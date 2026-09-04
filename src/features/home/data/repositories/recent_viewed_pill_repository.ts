import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRecentViewedPill } from '@common_types/recent_viewed_pill';

const RECENT_VIEWED_PILLS_KEY = 'recentViewed';

export interface IRecentViewedPillRepository {
  getAll(): Promise<TRecentViewedPill[]>;
  saveAll(pills: TRecentViewedPill[]): Promise<void>;
  clear(): Promise<void>;
}

export class RecentViewedPillRepository implements IRecentViewedPillRepository {
  constructor(
    private readonly storage: Pick<
      typeof AsyncStorage,
      'getItem' | 'setItem' | 'removeItem'
    > = AsyncStorage,
  ) {}

  async getAll(): Promise<TRecentViewedPill[]> {
    const raw = await this.storage.getItem(RECENT_VIEWED_PILLS_KEY);

    if (!raw) {
      return [];
    }

    return JSON.parse(raw) as TRecentViewedPill[];
  }

  async saveAll(pills: TRecentViewedPill[]): Promise<void> {
    await this.storage.setItem(RECENT_VIEWED_PILLS_KEY, JSON.stringify(pills));
  }

  async clear(): Promise<void> {
    await this.storage.removeItem(RECENT_VIEWED_PILLS_KEY);
  }
}

export const recentViewedPillRepository = new RecentViewedPillRepository();
