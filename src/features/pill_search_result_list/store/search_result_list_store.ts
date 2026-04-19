import { create } from 'zustand';
import { ISearchResultListStore } from '../types/pill_search_result_list';

export const useSearchResultListStore = create<ISearchResultListStore>(
  (set, get) => ({
    searchResultData: [],
    isLoading: false,
    searchParam: null,
    currentPage: 1,
    hasMore: true,

    // 검색 파라미터 저장 시 currentPage, hasMore 초기화
    setSearchParam: (param: any) =>
      set({
        searchParam: param,
        currentPage: 1,
        hasMore: true,
      }),
    setSearchResultData: (resultData) =>
      set({
        searchResultData: resultData,
        isLoading: false, // 데이터 설정 시 로딩 종료
      }),
    appendSearchResultData: (newData) =>
      set((state) => ({
        searchResultData: [...state.searchResultData, ...newData],
        isLoading: false,
      })),
    setIsLoading: (loading) =>
      set({
        isLoading: loading,
      }),
    getSearchResultData: () => {
      return get().searchResultData;
    },
    getSearchParam: () => {
      return get().searchParam;
    },
  }),
);
