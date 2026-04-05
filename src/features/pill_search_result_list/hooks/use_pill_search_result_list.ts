import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { getPillDatas } from '@/src/services/database/queries/pill_data';
import { useSearchResultListStore } from '../store/search_result_list_store';

export const usePillSearchResultList = () => {
  const router = useRouter();
  const { setSearchParam, setSearchResultData, setIsLoading } = useSearchResultListStore();
  const searchItemClickHandler = (seq: string, itemImage: string) => {
    // 페이지 먼저 전환 (ITEM_SEQ만 전달)
    router.push({
      pathname: '/pill-search-result-detail',
      params: {
        ITEM_SEQ: seq,
        itemImage: itemImage,
      },
    });
  };

  const keyExtractor = useCallback((item: any, index: number) => {
    // ITEM_SEQ를 우선 사용하여 안정적인 key 보장
    if (item.ITEM_SEQ) {
      return String(item.ITEM_SEQ);
    }
    // ITEM_SEQ가 없는 경우 여러 필드 조합으로 고유 key 생성
    return `pill-${item.ITEM_NAME || 'unknown'}-${item.ENTP_NAME || ''}-${index}`;
  }, []);

  /*
    검색 결과에서 검색 버튼 클릭 or enter 버튼 클릭 시 store 에 값 저장
    input 내용 기준으로 getPillDatas 함수를 실행해서 검색 input 내용은 ITEM_NAME 기준으로 다시 검색되도록
  * */
  const searchResultButtonClickHandler = async (searchText: string) => {
    try {
      // 검색어가 비어있으면 검색하지 않음
      if (!searchText.trim()) {
        return;
      }

      // 로딩 시작
      setIsLoading(true);

      // 기존 검색 파라미터 가져오기
      const currentSearchParam = useSearchResultListStore.getState().searchParam || {};

      // 기존 파라미터에 ITEM_NAME 추가/업데이트
      const searchParam = {
        ...currentSearchParam,
        ITEM_NAME: searchText.trim(),
      };

      // Store에 검색 파라미터 저장 (currentPage: 1로 초기화됨)
      setSearchParam(searchParam);

      // 데이터베이스에서 검색
      const results = await getPillDatas(searchParam, {
        page: 1,
        limit: 30,
      });

      // 검색 결과를 Store에 저장 (로딩 종료됨)
      setSearchResultData(results);

    } catch (error) {
      console.error('검색 실패:', error);
      setSearchResultData([]);
      setIsLoading(false);
    }
  };

  /*
    X 버튼 클릭 시 기존 식별 검색으로 재검색
  * */
  const clearSearchAndRestore = async () => {
    try {
      setIsLoading(true);

      // Store에서 기존 검색 파라미터 가져오기
      const currentSearchParam = useSearchResultListStore.getState().searchParam;

      if (!currentSearchParam) {
        // 검색 파라미터가 없으면 빈 결과 표시
        setSearchResultData([]);
        setIsLoading(false);
        return;
      }

      // ITEM_NAME 제거하고 나머지 파라미터로 검색 (식별 검색 파라미터만 유지)
      const { ITEM_NAME, ...restParams } = currentSearchParam;

      // 식별 검색 파라미터가 없으면 종료
      if (Object.keys(restParams).length === 0) {
        setSearchResultData([]);
        setIsLoading(false);
        return;
      }

      // 식별 검색 파라미터로 재검색
      setSearchParam(restParams);

      const results = await getPillDatas(restParams, {
        page: 1,
        limit: 30,
      });

      setSearchResultData(results);
    } catch (error) {
      console.error('검색 복원 실패:', error);
      setSearchResultData([]);
      setIsLoading(false);
    }
  };

  return {
    keyExtractor,
    searchItemClickHandler,
    searchResultButtonClickHandler,
    clearSearchAndRestore,
  };
};
