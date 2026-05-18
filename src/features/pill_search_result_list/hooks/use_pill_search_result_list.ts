import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { getPillDatas } from '@services/database/queries/pill_data';
import { useSearchResultListStore } from '@features/pill_search_result_list/store/search_result_list_store';
import { IPillData, TPillDataSearchParam } from '@services/database/types';
import logger from '@utils/logger';

export const usePillSearchResultList = () => {
  const router = useRouter();
  const { setSearchParam, setSearchResultData, setIsLoading } =
    useSearchResultListStore();

  /**
   * 아이템 클릭 시 상세 페이지로 이동
   */
  const searchItemClickHandler = useCallback(
    (seq: string, itemImage: string) => {
      router.push({
        pathname: '/pill-search-result-detail',
        params: { ITEM_SEQ: seq, itemImage: itemImage },
      });
    },
    [router],
  );

  /**
   * FlatList의 고유 키 추출
   */
  const keyExtractor = useCallback((item: IPillData, index: number) => {
    return item.ITEM_SEQ || `pill-${item.ITEM_NAME}-${index}`;
  }, []);

  /**
   * 텍스트 기반 검색 실행 로직
   */
  const executeSearchByText = useCallback(
    async (searchText: string, currentParam: Partial<TPillDataSearchParam>) => {
      const searchParam = { ...currentParam, ITEM_NAME: searchText.trim() };

      setSearchParam(searchParam);

      const results = await getPillDatas(searchParam, { page: 1, limit: 30 });

      setSearchResultData(results);
    },
    [setSearchParam, setSearchResultData],
  );

  /**
   * 검색 결과 내 재검색 버튼 클릭 핸들러
   */
  const searchResultButtonClickHandler = useCallback(
    async (searchText: string) => {
      if (!searchText.trim()) {
        return;
      }

      try {
        setIsLoading(true);

        const currentParam =
          useSearchResultListStore.getState().searchParam || {};

        await executeSearchByText(searchText, currentParam);
      } catch (e) {
        logger.error(`Failed to execute search by text: ${e.stack || e}`);

        setSearchResultData([]);
        setIsLoading(false);
      }
    },
    [setIsLoading, executeSearchByText, setSearchResultData],
  );

  /**
   * 기존 식별 검색 조건으로 복원 로직
   */
  const executeRestoreSearch = useCallback(
    async (currentParam: Partial<TPillDataSearchParam>) => {
      const { ITEM_NAME, ...restParams } = currentParam;

      if (Object.keys(restParams).length === 0) {
        setSearchResultData([]);

        setIsLoading(false);
        return;
      }

      setSearchParam(restParams);

      const results = await getPillDatas(restParams, { page: 1, limit: 30 });

      setSearchResultData(results);
    },
    [setSearchParam, setSearchResultData, setIsLoading],
  );

  /**
   * 검색어 초기화 및 이전 검색 결과 복원 핸들러
   */
  const clearSearchAndRestore = useCallback(async () => {
    try {
      setIsLoading(true);

      const currentParam = useSearchResultListStore.getState().searchParam;

      if (!currentParam) {
        setSearchResultData([]);

        setIsLoading(false);
        return;
      }

      await executeRestoreSearch(currentParam);
    } catch (e) {
      logger.error(`Failed to restore search: ${e.stack || e}`);

      setSearchResultData([]);
      setIsLoading(false);
    }
  }, [setIsLoading, executeRestoreSearch, setSearchResultData]);

  return {
    keyExtractor,
    searchItemClickHandler,
    searchResultButtonClickHandler,
    clearSearchAndRestore,
  };
};
