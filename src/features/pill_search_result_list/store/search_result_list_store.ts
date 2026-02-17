import { create } from 'zustand';
import { IPillDataSearchParam } from '@/src/services/database/types';

interface ISearchResultListStore {
  searchResultData: any[];
  isLoading: boolean;
  searchParam: Partial<IPillDataSearchParam> | null;
  currentPage: number;
  hasMore: boolean;

  setSearchParam: (param: any) => void;
  setSearchResultData: (resultData: any[]) => void;
  appendSearchResultData: (newData: any[]) => void; // 데이터 추가 (덮어쓰지 않음)
  setIsLoading: (loading: boolean) => void;
  getSearchResultData: () => any[];
  getSearchParam: () => any;
}

export const useSearchResultListStore = create<ISearchResultListStore>((set, get) => ({
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
