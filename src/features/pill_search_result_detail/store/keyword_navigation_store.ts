import { createStore } from 'zustand/vanilla';

export interface KeywordNavigationState {
  keywords: string[];
  activeKeyword: string;
  status: string;
  setKeywords: (keywords: string[]) => void;
  setActiveKeyword: (keyword: string) => void;
  setStatus: (status: string) => void;
}

// 화면별 검색 데이터·단순 Setter 생성.
export const createKeywordNavigationStore = () =>
  createStore<KeywordNavigationState>((set) => ({
    keywords: [],
    activeKeyword: '',
    status: '',
    setKeywords: (keywords) => set({ keywords }),
    setActiveKeyword: (activeKeyword) => set({ activeKeyword }),
    setStatus: (status) => set({ status }),
  }));
export type KeywordNavigationStore = ReturnType<
  typeof createKeywordNavigationStore
>;
