import { create } from 'zustand';
import { IPillData } from '@/src/services/database/types';

interface SearchResultListState {
  searchResultData: IPillData[];
  isLoading: boolean;

  // 상태 변경 함수
  setSearchResultData: (data: IPillData[]) => void;
  setIsLoading: (loading: boolean) => void;
  resetSearchResult: () => void;

  // getter 함수
  getSearchResultData: () => IPillData[];
}

export const useSearchResultListStore = create<SearchResultListState>(
  (set, get) => ({
    searchResultData: [],
    isLoading: false,

    setSearchResultData: (data: IPillData[]) =>
      set(() => ({ searchResultData: data, isLoading: false })),

    setIsLoading: (loading: boolean) => set(() => ({ isLoading: loading })),

    resetSearchResult: () =>
      set(() => ({ searchResultData: [], isLoading: false })),

    getSearchResultData: () => get().searchResultData,
  }),
);
