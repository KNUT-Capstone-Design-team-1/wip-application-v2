import { router } from 'expo-router';
import { getPillDatas } from '@services/database/queries/pill_data';
import { TPillDataSearchParam } from '@services/database/types';
import { useSearchResultListStore } from '@features/pill_search_result_list/store/search_result_list_store';
import { usePillSearchListStore } from '@store/pill_search_list_store';
import logger from '@utils/logger';

/**
 * 알약 검색 공유 Hook
 * - 초기 검색
 * - 무한 스크롤 (페이지네이션)
 * - 검색 상태 관리
 */
export const usePillSearch = () => {
  const { setSearchResultData, appendSearchResultData, setIsLoading } =
    useSearchResultListStore();
  const { setLimitValue, getLimitValue } = usePillSearchListStore();

  /**
   * 현재 페이지 가져오기 및 다음 페이지로 증가
   * @returns 현재 페이지 번호
   */
  const getCurrentPageAndIncrement = (): number => {
    const currentPage = getLimitValue();
    setLimitValue(currentPage + 1);
    return currentPage;
  };

  /**
   * 검색 조건에서 "전체" 제거 및 빈 값 필터링
   */
  const filterSearchParam = (rawParam: any): Partial<TPillDataSearchParam> => {
    const filtered: any = {};

    // 문자열 필드들 - 빈 문자열이 아닌 경우만 추가
    if (rawParam.PRINT_FRONT && rawParam.PRINT_FRONT.trim()) {
      filtered.PRINT_FRONT = rawParam.PRINT_FRONT.trim();
    }
    if (rawParam.PRINT_BACK && rawParam.PRINT_BACK.trim()) {
      filtered.PRINT_BACK = rawParam.PRINT_BACK.trim();
    }
    if (rawParam.ITEM_NAME && rawParam.ITEM_NAME.trim()) {
      filtered.ITEM_NAME = rawParam.ITEM_NAME.trim();
    }
    if (rawParam.ENTP_NAME && rawParam.ENTP_NAME.trim()) {
      filtered.ENTP_NAME = rawParam.ENTP_NAME.trim();
    }

    // 배열 필드들 - "전체" 제거 및 빈 배열이 아닌 경우만 추가
    const filterArray = (arr: string[]) => {
      const filtered = arr.filter((item) => item !== '전체' && item.trim());
      return filtered.length > 0 ? filtered : undefined;
    };

    const drugShapeFiltered = filterArray(rawParam.DRUG_SHAPE || []);
    if (drugShapeFiltered) {
      filtered.DRUG_SHAPE = drugShapeFiltered;
    }

    const colorClass1Filtered = filterArray(rawParam.COLOR_CLASS1 || []);
    if (colorClass1Filtered) {
      filtered.COLOR_CLASS1 = colorClass1Filtered;
    }

    const colorClass2Filtered = filterArray(rawParam.COLOR_CLASS2 || []);
    if (colorClass2Filtered) {
      filtered.COLOR_CLASS2 = colorClass2Filtered;
    }

    const lineFrontFiltered = filterArray(rawParam.LINE_FRONT || []);
    if (lineFrontFiltered) {
      filtered.LINE_FRONT = lineFrontFiltered;
    }

    const lineBackFiltered = filterArray(rawParam.LINE_BACK || []);
    if (lineBackFiltered) {
      filtered.LINE_BACK = lineBackFiltered;
    }

    return filtered;
  };

  /**
   * 초기 검색 (첫 페이지)
   * @param rawSearchParam 원본 검색 조건
   * @param options.navigateToResult 결과 페이지로 이동할지 여부
   */
  const searchPills = async (
    rawSearchParam: any,
    options: { navigateToResult?: boolean } = {},
  ) => {
    try {
      const searchParam = filterSearchParam(rawSearchParam); // "전체" 제거 및 빈 값 필터링

      console.log(`Search Param: ${searchParam}`);

      // 검색 조건이 하나도 없으면 경고
      if (Object.keys(searchParam).length === 0) {
        return {
          success: false,
          results: [],
          message: '검색 조건을 입력해주세요.',
        };
      }

      // 로딩 시작
      setIsLoading(true);

      // searchParam 먼저 저장
      useSearchResultListStore.setState({
        searchParam,
        currentPage: 1,
        hasMore: true,
      });

      // 결과 페이지로 이동 (옵션)
      if (options.navigateToResult) {
        router.push('/pill-search-result-list');
      }

      // 현재 페이지 가져오기 및 증가
      const currentPage = getCurrentPageAndIncrement();

      // 데이터베이스 검색
      const results = await getPillDatas(searchParam, {
        page: currentPage,
        limit: 30,
      });

      console.log(`Search result: ${JSON.stringify(results)}`);

      // Store에 저장 (자동으로 로딩 종료)
      setSearchResultData(results);

      // hasMore 업데이트
      useSearchResultListStore.setState({
        hasMore: results.length === 30,
      });

      return { success: true, results, message: '검색 완료' };
    } catch (e) {
      logger.error(`Failed to search pills. ${e.stack || e}`);

      setIsLoading(false);

      return {
        success: false,
        results: [],
        message: e?.message || '알 수 없는 에러',
      };
    }
  };

  /**
   * 다음 페이지 로드 (무한 스크롤)
   */
  const loadMorePills = async () => {
    const state = useSearchResultListStore.getState();
    const { searchParam, hasMore, isLoading, currentPage } = state;

    // 이미 로딩 중이거나 더 이상 데이터가 없으면 중단
    if (isLoading || !hasMore || !searchParam) {
      return;
    }

    try {
      setIsLoading(true);

      const nextPage = currentPage + 1;

      console.log(`📄 페이지 ${nextPage} 로드 중...`);

      // 데이터베이스 조회
      const newResults = await getPillDatas(searchParam, {
        page: nextPage,
        limit: 30,
      });

      console.log(`✅ ${newResults.length}개 추가 로드`);

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
  };

  return {
    searchPills,
    loadMorePills,
    filterSearchParam,
  };
};
