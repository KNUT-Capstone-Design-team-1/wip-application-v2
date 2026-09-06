import { recentViewedPillRepository } from '@features/home/data/repositories/recent_viewed_pill_repository';
import { TRecentViewedPill } from '@common_types/recent_viewed_pill';

const MAX_RECENT_VIEWED_PILLS = 7;

export const recentViewedPillService = {
  async getRecentViewedPills(): Promise<TRecentViewedPill[]> {
    return recentViewedPillRepository.getAll();
  },

  async addRecentViewedPill(pill: TRecentViewedPill): Promise<void> {
    const pills = await recentViewedPillRepository.getAll();
    const updatedPills = [
      pill,
      ...pills.filter((item) => item.ITEM_SEQ !== pill.ITEM_SEQ),
    ].slice(0, MAX_RECENT_VIEWED_PILLS);

    await recentViewedPillRepository.saveAll(updatedPills);
  },

  async deleteRecentViewedPill(itemSeq: string): Promise<void> {
    const pills = await recentViewedPillRepository.getAll();
    await recentViewedPillRepository.saveAll(
      pills.filter((pill) => pill.ITEM_SEQ !== itemSeq),
    );
  },

  async clearRecentViewedPills(): Promise<void> {
    await recentViewedPillRepository.clear();
  },
};
