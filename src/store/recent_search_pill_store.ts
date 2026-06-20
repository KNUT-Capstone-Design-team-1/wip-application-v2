import { create } from 'zustand';
import { IPillDetail } from '../features/pill_search_result_detail/types/pill_detail_type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '../utils/logger';
import { TRecentSearchPill } from '@common_types/recent_search_pill';

interface IRecentSearchPillStore {
  recentSearchPills: TRecentSearchPill[];
  getRecentSearchPills: () => void;
  setRecentSearchPills: (pillData: TRecentSearchPill) => void;
  deleteRecentSearch: (itemSeq: string) => void;
  resetRecentSearch: () => void;
}

export const useRecentSearchPillStore = create<IRecentSearchPillStore>(
  (set, get) => ({
    recentSearchPills: [],
    getRecentSearchPills: async () => {
      try {
        const raw = await AsyncStorage.getItem('recentSearch');
        if (raw) {
          const pills: IPillDetail[] = JSON.parse(raw);
          set({ recentSearchPills: pills });
        }
      } catch (e) {
        logger.error(`Failed to load recent search pills: ${e.stack || e}`);
      }
    },
    setRecentSearchPills: async (pillData: TRecentSearchPill) => {
      try {
        const { recentSearchPills } = get();

        // 중복 제거 및 최신화
        const filteredList = recentSearchPills.filter(
          (item: TRecentSearchPill) => item.ITEM_SEQ !== pillData.ITEM_SEQ,
        );

        const updateList = [pillData, ...filteredList].slice(0, 7);

        await AsyncStorage.setItem('recentSearch', JSON.stringify(updateList));
        set({ recentSearchPills: updateList });
      } catch (e) {
        logger.error(`Failed to save recent search. ${e.stack || e}`);
      }
    },
    deleteRecentSearch: async (itemSeq: string) => {
      try {
        const { recentSearchPills } = get();
        const updatedPills = recentSearchPills.filter(
          (pill: TRecentSearchPill) => pill.ITEM_SEQ !== itemSeq,
        );
        await AsyncStorage.setItem(
          'recentSearch',
          JSON.stringify(updatedPills),
        );
        set({ recentSearchPills: updatedPills });
      } catch (e) {
        logger.error(`Failed to delete recent search: ${e.stack || e}`);
      }
    },
    resetRecentSearch: async () => {
      try {
        await AsyncStorage.removeItem('recentSearch');
        set({ recentSearchPills: [] });
      } catch (e) {
        logger.error(`Failed to reset recent search: ${e.stack || e}`);
      }
    },
  }),
);
