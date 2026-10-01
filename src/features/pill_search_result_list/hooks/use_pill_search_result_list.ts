import { useRouter } from 'expo-router';
import { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import { useSearchResultListStore } from '@features/pill_search_result_list/store/search_result_list_store';
import { IPillData } from '@services/database/types';
import { TSearchResultListItem } from '@features/pill_search_result_list/types/pill_search_result_list';
import logger from '@utils/logger';
import { pillSearchResultListService } from '../services/pill_search_result_list_service';
import { unifiedSearchService } from '@features/unified_search/services/unifiedSearchService';
import { useToast } from '@hooks/use_toast';

import { useSearchResultListAdStore } from '@features/pill_search_result_list/store/search_result_list_ad_store';

// 상위 100개 이내에 배치할 광고 위치 (안정적인 고정 오프셋)
// - 100개 이내에 최대 5개 배치
// - 1페이지(30개): 8번째, 25번째
// - 2페이지(30~60개): 45번째
// - 3페이지(60~90개): 65번째, 85번째
// - 100개 초과(무한 스크롤 추가 데이터): 광고 배치 중단
const AD_PLACEMENTS = [8, 25, 45, 65, 85];

const insertAdsIntoList = (
  items: IPillData[],
  adPlacements: number[] = AD_PLACEMENTS,
): TSearchResultListItem[] => {
  if (!items || items.length === 0) return [];

  const result: TSearchResultListItem[] = [];
  const placementSet = new Set(adPlacements);
  let adCount = 0;

  for (let i = 0; i < items.length; i++) {
    result.push({ type: 'item', data: items[i] });

    // 100개 이내의 지정된 위치에 광고 슬롯 삽입 (단, 전체 데이터의 마지막 아이템 뒤는 제외)
    // 순번 기반의 고정 슬롯 ID(Stable Slot Key)를 부여하여 재검색 시에도 60초 TTL 이내의 광고를 0ms로 재사용
    if (placementSet.has(i + 1) && i !== items.length - 1) {
      result.push({
        type: 'ads',
        id: `search-list-ad-slot-${adCount++}`,
      });
    }
  }

  return result;
};

/**
 * 알약 검색(InputText) Hook
 * - 초기 검색
 * - 무한 스크롤 (페이지네이션 sqlite Limit)
 * - 검색 상태 관리
 * - 상위 100개 이내 고정 광고 슬롯 선배치 (최대 5개 제한)
 */
export const usePillSearchResultList = (rawSearchResultData?: IPillData[]) => {
  const router = useRouter();
  const { showToast } = useToast();
  const appendSearchResultData = useSearchResultListStore(
    (state) => state.appendSearchResultData,
  );
  const setTotalDataCount = useSearchResultListStore(
    (state) => state.setTotalDataCount,
  );
  const setIsLoading = useSearchResultListStore((state) => state.setIsLoading);
  const searchParam = useSearchResultListStore((state) => state.searchParam);
  const searchKey = searchParam?.KEYWORD || searchParam?.ITEM_NAME || '';

  // 검색어 변경 시 뷰포트 광고 슬롯 리셋 (광고 수명 및 메모리는 useNativeAd의 60초 스마트 쿨다운이 자동 관리)
  useEffect(() => {
    useSearchResultListAdStore.getState().resetAdSlots();
  }, [searchKey]);

  // 상위 100개 이내에 최대 5개의 광고 슬롯이 선배치된 리스트 (No-Fill 시 컴포넌트 내부에서 자체 축소)
  const displayList = useMemo(
    () => insertAdsIntoList(rawSearchResultData ?? [], AD_PLACEMENTS),
    [rawSearchResultData],
  );

  // 스크롤 상태 추적 (이미지 지연 로딩용)
  const isScrollingRef = useRef(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  const handleScrollBegin = useCallback(() => {
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = null;
    }
    if (!isScrollingRef.current) {
      isScrollingRef.current = true;
      setIsScrolling(true);
    }
  }, []);

  const handleScrollEnd = useCallback(() => {
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    scrollTimerRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      setIsScrolling(false);
    }, 150);
  }, []);

  // 아이템 클릭 시 상세 페이지로 이동
  const searchItemClickHandler = useCallback(
    (seq: string, itemImage: string) => {
      router.push({
        pathname: '/pill-search-result-detail',
        params: { ITEM_SEQ: seq, itemImage: itemImage },
      });
    },
    [router],
  );

  // FlatList/FlashList의 고유 키 추출 (아이템 및 광고 식별)
  const keyExtractor = useCallback(
    (item: TSearchResultListItem, index: number) => {
      if (item.type === 'ads') {
        return item.id;
      }
      return item.data.ITEM_SEQ || `pill-${item.data.ITEM_NAME}-${index}`;
    },
    [],
  );

  // FlashList 뷰홀더 재활용 분리 (일반 알약 vs 네이티브 광고)
  const getItemType = useCallback((item: TSearchResultListItem) => {
    return item.type;
  }, []);

  // 다음 페이지 로드 (무한 스크롤)
  const loadMorePills = useCallback(async () => {
    const state = useSearchResultListStore.getState();
    const {
      searchParam,
      hasMore,
      isLoading,
      currentPage,
      nextCursor,
      totalDataCount,
    } = state;

    // 이미 로딩 중이거나 더 이상 데이터가 없으면 중단
    if (isLoading || !hasMore || !searchParam) {
      return;
    }

    // 1. 통합 검색인 경우 (Cloudflare Worker 커서 기반 페이지네이션)
    if (searchParam.KEYWORD) {
      if (!nextCursor) {
        useSearchResultListStore.setState({ hasMore: false });
        return;
      }

      try {
        setIsLoading(true);

        const searchResult = await unifiedSearchService.executeUnifiedSearch(
          searchParam.KEYWORD,
          100,
          nextCursor,
        );

        if (!searchResult.success) {
          logger.error(
            `Failed to load more unified search pills: ${searchResult.message}`,
          );
          return;
        }

        const newResults = searchResult.results;
        if (newResults.length > 0) {
          appendSearchResultData(newResults);
          setTotalDataCount(totalDataCount + newResults.length);
        }

        useSearchResultListStore.setState({
          nextCursor: searchResult.nextCursor,
          hasMore: searchResult.hasMore,
        });
      } catch (e) {
        logger.error(
          `Failed to load more unified search pills: ${e.stack || e}`,
        );
        // 추가 데이터 로드 중 에러 발생 시 에러 토스트 표시
        showToast({
          type: 'error',
          message: '데이터를 불러오던 중 에러가 발생했습니다',
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // 2. 식별 검색인 경우 (로컬 SQLite 페이지네이션)
    try {
      setIsLoading(true);

      const nextPage = currentPage + 1;

      console.log(`Page ${nextPage} loading...`);

      // 데이터베이스 조회
      const newResults = await pillSearchResultListService.getPills(
        searchParam,
        {
          page: nextPage,
          limit: 30,
        },
      );

      console.log(`${newResults.length} loaded for page ${nextPage}`);

      // 기존 데이터에 추가 (덮어쓰지 않음)
      appendSearchResultData(newResults);

      // 페이지 정보 업데이트
      useSearchResultListStore.setState({
        currentPage: nextPage,
        hasMore: newResults.length === 30,
      });
    } catch (e) {
      logger.error(`Failed to load more pills. ${e.stack || e}`);
      // 추가 데이터 로드 중 에러 발생 시 에러 토스트 표시
      showToast({
        type: 'error',
        message: '데이터를 불러오던 중 에러가 발생했습니다',
      });
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, appendSearchResultData, setTotalDataCount, showToast]);

  return {
    displayList,
    keyExtractor,
    getItemType,
    searchItemClickHandler,
    loadMorePills,
    isScrolling,
    handleScrollBegin,
    handleScrollEnd,
  };
};
