import { create } from 'zustand';
import { IPillDetail } from '../features/pill_search_result_detail/types/pill_detail_type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '../utils/logger';
import { TRecentViewedPill } from '@common_types/recent_viewed_pill';

interface IRecentViewedPillStore {
  recentViewedPills: TRecentViewedPill[];
  getRecentViewedPills: () => void;
  setRecentViewedPills: (pillData: TRecentViewedPill) => void;
  deleteRecentViewed: (itemSeq: string) => void;
  resetRecentViewed: () => void;
}

export const useRecentViewedPillStore = create<IRecentViewedPillStore>(
  (set, get) => ({
    recentViewedPills: [],
    getRecentViewedPills: async () => {
      try {
        const raw = await AsyncStorage.getItem('recentViewed');
        if (raw) {
          const pills: IPillDetail[] = JSON.parse(raw);
          set({ recentViewedPills: pills });
        }
      } catch (e) {
        logger.error(`Failed to load recent search pills: ${e.stack || e}`);
      }
    },
    setRecentViewedPills: async (pillData: TRecentViewedPill) => {
      try {
        const { recentViewedPills } = get();

        // 중복 제거 및 최신화
        const filteredList = recentViewedPills.filter(
          (item: TRecentViewedPill) => item.ITEM_SEQ !== pillData.ITEM_SEQ,
        );

        const updateList = [pillData, ...filteredList].slice(0, 7);

        await AsyncStorage.setItem('recentViewed', JSON.stringify(updateList));
        set({ recentViewedPills: updateList });
      } catch (e) {
        logger.error(`Failed to save recent search. ${e.stack || e}`);
      }
    },
    deleteRecentViewed: async (itemSeq: string) => {
      try {
        const { recentViewedPills } = get();
        const updatedPills = recentViewedPills.filter(
          (pill: TRecentViewedPill) => pill.ITEM_SEQ !== itemSeq,
        );
        await AsyncStorage.setItem(
          'recentViewed',
          JSON.stringify(updatedPills),
        );
        set({ recentViewedPills: updatedPills });
      } catch (e) {
        logger.error(`Failed to delete recent search: ${e.stack || e}`);
      }
    },
    resetRecentViewed: async () => {
      try {
        await AsyncStorage.removeItem('recentViewed');
        set({ recentViewedPills: [] });
      } catch (e) {
        logger.error(`Failed to reset recent search: ${e.stack || e}`);
      }
    },
  }),
);
