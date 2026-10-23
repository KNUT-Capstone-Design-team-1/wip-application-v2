import { requestGetPillDetail } from '@services/apis/google_cloud/wip_pill_detail';

// 원격 상세 문서 API 연결.
export const pillDetailRemoteDataSource = {
  getPillDetail: requestGetPillDetail,
};
