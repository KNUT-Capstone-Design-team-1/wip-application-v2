import { requestReadNotices } from '@services/apis/cloud_flare/wip_notice';

export const noticeRemoteDataSource = {
  // 공지사항 원격 API 조회
  async fetchNotices() {
    return await requestReadNotices();
  },
};
