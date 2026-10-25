import type { KeywordNavigationState } from '../types/keyword_navigation_type';
import { createStore } from 'zustand/vanilla';

// 화면별 검색 데이터·단순 Setter 생성.
export const createKeywordNavigationStore = () =>
  createStore<KeywordNavigationState>((set) => ({
    keywords: [],
    isSearchOpen: false,
    searchQuery: '',
    searchRequest: null,
    requestSearch: (query) =>
      set({ isSearchOpen: true, searchRequest: { query } }),
    setSearchOpen: (isSearchOpen) =>
      set((state) => ({
        isSearchOpen,
        searchRequest: isSearchOpen ? state.searchRequest : null,
      })),
    setSearchQuery: (searchQuery) =>
      set((state) => {
        const sameQuery = state.searchQuery === searchQuery;
        const isAlreadyReset =
          sameQuery &&
          state.currentIndex === 0 &&
          state.totalCount === 0 &&
          !state.canPrevious &&
          !state.canNext;

        if (isAlreadyReset) {
          return state;
        }

        let keywords = state.keywords;

        if (!sameQuery) {
          keywords = searchQuery ? [searchQuery] : [];
        }

        return {
          searchQuery,
          currentIndex: 0,
          totalCount: 0,
          // 같은 검색어를 다시 실행해도 표 문서는 새로 만들지 않는다.
          keywords,
          canPrevious: false,
          canNext: false,
        };
      }),
    currentIndex: 0,
    totalCount: 0,
    canPrevious: false,
    canNext: true,
    setAvailability: (availability) =>
      set((state) => {
        const isUnchanged =
          state.currentIndex === availability.currentIndex &&
          state.totalCount === availability.totalCount &&
          state.canPrevious === availability.canPrevious &&
          state.canNext === availability.canNext;

        return isUnchanged ? state : availability;
      }),
  }));
