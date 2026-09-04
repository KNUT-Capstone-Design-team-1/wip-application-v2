import { create } from 'zustand';
import { IPillDetail } from '../features/pill_search_result_detail/types/pill_detail_type';
import logger from '../utils/logger';
import { TRecentViewedPill } from '@common_types/recent_viewed_pill';
import { recentViewedPillService } from '@features/home/services/recent_viewed_pill_service';

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
        const pills = await recentViewedPillService.getRecentViewedPills();
        set({ recentViewedPills: pills });
      } catch (e) {
        logger.error(`Failed to load recent search pills: ${e.stack || e}`);
      }
    },
    setRecentViewedPills: async (pillData: TRecentViewedPill) => {
      try {
        await recentViewedPillService.addRecentViewedPill(pillData);
        const updateList = await recentViewedPillService.getRecentViewedPills();
        set({ recentViewedPills: updateList });
      } catch (e) {
        logger.error(`Failed to save recent search. ${e.stack || e}`);
      }
    },
    deleteRecentViewed: async (itemSeq: string) => {
      try {
        await recentViewedPillService.deleteRecentViewedPill(itemSeq);
        const updatedPills =
          await recentViewedPillService.getRecentViewedPills();
        set({ recentViewedPills: updatedPills });
      } catch (e) {
        logger.error(`Failed to delete recent search: ${e.stack || e}`);
      }
    },
    resetRecentViewed: async () => {
      try {
        await recentViewedPillService.clearRecentViewedPills();
        set({ recentViewedPills: [] });
      } catch (e) {
        logger.error(`Failed to reset recent search: ${e.stack || e}`);
      }
    },
  }),
);
