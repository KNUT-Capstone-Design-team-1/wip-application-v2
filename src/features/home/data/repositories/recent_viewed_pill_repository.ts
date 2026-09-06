import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRecentViewedPill } from '@common_types/recent_viewed_pill';

const RECENT_VIEWED_PILLS_KEY = 'recentViewed';

export const recentViewedPillRepository = {
  async getAll(): Promise<TRecentViewedPill[]> {
    const raw = await AsyncStorage.getItem(RECENT_VIEWED_PILLS_KEY);

    if (!raw) {
      return [];
    }

    return JSON.parse(raw) as TRecentViewedPill[];
  },

  async saveAll(pills: TRecentViewedPill[]): Promise<void> {
    await AsyncStorage.setItem(RECENT_VIEWED_PILLS_KEY, JSON.stringify(pills));
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(RECENT_VIEWED_PILLS_KEY);
  },
};
