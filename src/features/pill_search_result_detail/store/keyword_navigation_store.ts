import { createStore } from 'zustand/vanilla';
import { KeywordNavigationAvailability } from '../types/keyword_navigation_type';

export interface KeywordNavigationState extends KeywordNavigationAvailability {
  keywords: string[];
  isVisible: boolean;
  setKeywords: (keywords: string[]) => void;
  setVisible: (isVisible: boolean) => void;
  setAvailability: (availability: KeywordNavigationAvailability) => void;
}

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
export type KeywordNavigationStore = ReturnType<
  typeof createKeywordNavigationStore
>;
