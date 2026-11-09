import { requestGetPillDetail } from '@services/apis/google_cloud/wip_pill_detail';
import { pillDetailCache } from '../cache/pill_detail_cache';

export const pillDetailRemoteDataSource = {
  getPillDetail: (itemSeq: string) =>
    pillDetailCache.get(itemSeq, requestGetPillDetail),
};
