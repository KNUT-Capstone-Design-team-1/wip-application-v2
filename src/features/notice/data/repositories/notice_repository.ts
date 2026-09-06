import { noticeRemoteDataSource } from '../datasources/notice_remote_datasource';
import { noticeLocalDataSource } from '../datasources/notice_local_datasource';
import { INoticeData } from '@features/notice/types/notice_type';

export const noticeRepository = {
  // 원격 공지사항 목록 조회
  async fetchRemoteNotices(): Promise<INoticeData[]> {
    const response = await noticeRemoteDataSource.fetchNotices();
    return (response.notices as unknown as INoticeData[]) || [];
  },

  // 로컬 캐시 공지사항 조회
  async getCachedNotices(): Promise<INoticeData[] | null> {
    return await noticeLocalDataSource.getCachedNotices();
  },

  // 로컬 캐시 공지사항 저장
  async saveCachedNotices(notices: INoticeData[]): Promise<void> {
    await noticeLocalDataSource.saveCachedNotices(notices);
  },
};
