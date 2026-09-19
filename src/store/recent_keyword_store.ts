import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const MAX_RECENT_KEYWORDS = 50;

interface IRecentKeywordStore {
  keywords: string[];
  addRecentKeyword: (keyword: string) => void;
  removeRecentKeyword: (keyword: string) => void;
  clearRecentKeywords: () => void;
}

export const useRecentKeywordStore = create<IRecentKeywordStore>()(
  persist(
    (set) => ({
      keywords: [],
      addRecentKeyword: (keyword: string) => {
        const trimmed = keyword.trim();
        if (!trimmed) return;

        set((state) => ({
          // 기존 키워드 제거 후 최상단에 추가하여 LRU 및 중복 방지 보장
          keywords: [
            trimmed,
            ...state.keywords.filter((k) => k !== trimmed),
          ].slice(0, MAX_RECENT_KEYWORDS),
        }));
      },
      removeRecentKeyword: (keyword: string) => {
        const trimmed = keyword.trim();
        set((state) => ({
          keywords: state.keywords.filter((k) => k !== trimmed),
        }));
      },
      clearRecentKeywords: () => {
        set({ keywords: [] });
      },
    }),
    {
      name: 'recent_keyword_store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
