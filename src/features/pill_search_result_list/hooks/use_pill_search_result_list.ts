import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useSearchResultListStore } from '@features/pill_search_result_list/store/search_result_list_store';
import { IPillData, TPillDataSearchParam } from '@services/database/types';
import logger from '@utils/logger';
import { pillSearchResultListService } from '../services/pill_search_result_list_service';
import { unifiedSearchService } from '@features/unified_search/services/unifiedSearchService';
import { useToast } from '@hooks/use_toast';

/**
 * 알약 검색(InputText) Hook
 * - 초기 검색
 * - 무한 스크롤 (페이지네이션 sqlite Limit)
 * - 검색 상태 관리
 */

export const usePillSearchResultList = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const {
    setSearchParam,
    setSearchResultData,
    setTotalDataCount,
    setIsLoading,
    appendSearchResultData,
  } = useSearchResultListStore();

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

  // FlatList의 고유 키 추출
  const keyExtractor = useCallback((item: IPillData, index: number) => {
    return item.ITEM_SEQ || `pill-${item.ITEM_NAME}-${index}`;
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
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, appendSearchResultData, setTotalDataCount]);

  return {
    keyExtractor,
    searchItemClickHandler,
    loadMorePills,
  };
};
