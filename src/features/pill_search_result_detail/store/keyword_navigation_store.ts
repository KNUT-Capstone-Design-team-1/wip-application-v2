import type { KeywordNavigationState } from '../types/keyword_navigation_type';
import { createStore } from 'zustand/vanilla';

// 화면별 검색 데이터·단순 Setter 생성.
export const createKeywordNavigationStore = () =>
  createStore<KeywordNavigationState>((set) => ({
    keywords: [],
    isVisible: false,
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
      set({
        searchQuery,
        currentIndex: 0,
        totalCount: 0,
        keywords: searchQuery ? [searchQuery] : [],
        canPrevious: false,
        canNext: false,
      }),
    currentIndex: 0,
    totalCount: 0,
    canPrevious: false,
    canNext: true,
    setVisible: (isVisible) => set({ isVisible }),
    setAvailability: (availability) => set(availability),
  }));
