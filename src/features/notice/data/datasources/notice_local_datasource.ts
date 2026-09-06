import AsyncStorage from '@react-native-async-storage/async-storage';
import { INoticeData } from '@features/notice/types/notice_type';
import logger from '@utils/logger';

const NOTICE_CACHE_KEY = 'cachedNoticeData';

export const noticeLocalDataSource = {
  // 로컬 스토리지에 캐시된 공지사항 로드
  async getCachedNotices(): Promise<INoticeData[] | null> {
    try {
      const cachedData = await AsyncStorage.getItem(NOTICE_CACHE_KEY);
      return cachedData ? JSON.parse(cachedData) : null;
    } catch (e) {
      logger.error(
        `[NOTICE-LOCAL-DATASOURCE] Failed to get cached notices: ${e}`,
      );
      return null;
    }
  },

  // 공지사항 로컬 스토리지 캐싱
  async saveCachedNotices(notices: INoticeData[]): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTICE_CACHE_KEY, JSON.stringify(notices));
    } catch (e) {
      logger.error(`[NOTICE-LOCAL-DATASOURCE] Failed to cache notices: ${e}`);
    }
  },
};
