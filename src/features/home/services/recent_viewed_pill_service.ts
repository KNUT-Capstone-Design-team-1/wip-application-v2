import {
  IRecentViewedPillRepository,
  recentViewedPillRepository,
} from '@features/home/data/repositories/recent_viewed_pill_repository';
import { TRecentViewedPill } from '@common_types/recent_viewed_pill';

const MAX_RECENT_VIEWED_PILLS = 7;

export class RecentViewedPillService {
  constructor(
    private readonly repository: IRecentViewedPillRepository = recentViewedPillRepository,
  ) {}

  async getRecentViewedPills(): Promise<TRecentViewedPill[]> {
    return this.repository.getAll();
  }

  async addRecentViewedPill(pill: TRecentViewedPill): Promise<void> {
    const pills = await this.repository.getAll();
    const updatedPills = [
      pill,
      ...pills.filter((item) => item.ITEM_SEQ !== pill.ITEM_SEQ),
    ].slice(0, MAX_RECENT_VIEWED_PILLS);

    await this.repository.saveAll(updatedPills);
  }

  async deleteRecentViewedPill(itemSeq: string): Promise<void> {
    const pills = await this.repository.getAll();
    await this.repository.saveAll(
      pills.filter((pill) => pill.ITEM_SEQ !== itemSeq),
    );
  }

  async clearRecentViewedPills(): Promise<void> {
    await this.repository.clear();
  }
}

export const recentViewedPillService = new RecentViewedPillService();
