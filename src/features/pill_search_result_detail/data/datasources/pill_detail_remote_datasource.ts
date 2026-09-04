import { requestGetPillDetail } from '@services/apis/google_cloud/wip_pill_detail';

export interface IPillDetailRemoteDataSource {
  getPillDetail(itemSeq: string): ReturnType<typeof requestGetPillDetail>;
}

export class PillDetailRemoteDataSource implements IPillDetailRemoteDataSource {
  // 서버에서 알약 상세 문서를 조회한다.
  getPillDetail(itemSeq: string) {
    return requestGetPillDetail(itemSeq);
  }
}

export const pillDetailRemoteDataSource = new PillDetailRemoteDataSource();
