import type { KeywordNavigationState } from '../types/keyword_navigation_type';
import { createStore } from 'zustand/vanilla';

// 화면별 검색 데이터·단순 Setter 생성.
export const createKeywordNavigationStore = () =>
  createStore<KeywordNavigationState>((set) => ({
    keywords: [],
    isVisible: false,
    canPrevious: false,
    canNext: true,
    setKeywords: (keywords) => set({ keywords }),
    setVisible: (isVisible) => set({ isVisible }),
    setAvailability: (availability) => set(availability),
  }));
