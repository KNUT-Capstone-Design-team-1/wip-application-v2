import { noticeRepository } from '../data/repositories/notice_repository';
import { INoticeData } from '@features/notice/types/notice_type';
import logger from '@utils/logger';

export const noticeService = {
  /**
   * 공지사항 데이터 정렬 (필독 우선 -> 최신순)
   */
  sortNotices(notices: INoticeData[]): INoticeData[] {
    return [...notices].sort((a, b) => {
      if (a.mustRead !== b.mustRead) {
        return b.mustRead - a.mustRead;
      }
      return b.idx - a.idx;
    });
  },

  /**
   * 전체 공지사항 목록을 API로부터 가져와 정렬
   */
  async getNoticeList(): Promise<INoticeData[]> {
    try {
      const notices = await noticeRepository.fetchRemoteNotices();
      return this.sortNotices(notices);
    } catch (e) {
      logger.error(`[NOTICE-SERVICE] Failed to get notice list: ${e}`);
      return [];
    }
  },

  /**
   * 캐시된 공지사항 로드
   */
  async getCachedNotices(): Promise<INoticeData[] | null> {
    return await noticeRepository.getCachedNotices();
  },

  /**
   * 공지사항 캐싱
   */
  async cacheNotices(notices: INoticeData[]): Promise<void> {
    await noticeRepository.saveCachedNotices(notices);
  },

  /**
   * 필독 공지사항 필터링
   */
  filterMustReadNotices(notices: INoticeData[]): INoticeData[] {
    return notices.filter((n) => n.mustRead === 1);
  },
};
