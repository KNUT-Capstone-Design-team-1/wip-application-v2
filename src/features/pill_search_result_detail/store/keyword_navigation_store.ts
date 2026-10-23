import type { KeywordNavigationState } from '../types/keyword_navigation_type';
import { createStore } from 'zustand/vanilla';

// 화면별 검색 데이터·단순 Setter 생성.
export const createKeywordNavigationStore = () =>
  createStore<KeywordNavigationState>((set) => ({
    keywords: [],
    isVisible: false,
    isSearchOpen: false,
    searchQuery: '',
    warningKeywords: [],
    setSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
    setSearchQuery: (searchQuery) =>
      set((state) => ({
        searchQuery,
        currentIndex: 0,
        totalCount: 0,
        keywords: searchQuery ? [searchQuery] : state.warningKeywords,
      })),
    currentIndex: 0,
    totalCount: 0,
    canPrevious: false,
    canNext: true,
    setKeywords: (warningKeywords) =>
      set((state) => ({
        warningKeywords,
        currentIndex: 0,
        totalCount: 0,
        keywords: state.searchQuery ? [state.searchQuery] : warningKeywords,
      })),
    setVisible: (isVisible) => set({ isVisible }),
    setAvailability: (availability) => set(availability),
  }));
