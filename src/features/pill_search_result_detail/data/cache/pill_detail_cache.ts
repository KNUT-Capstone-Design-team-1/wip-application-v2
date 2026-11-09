import type { requestGetPillDetail } from '@services/apis/google_cloud/wip_pill_detail';

import {
  REMOTE_DETAIL_CACHE_TTL_MS,
  REMOTE_DETAIL_CACHE_LIMIT,
} from '../../constants/pill_detail';

type RemoteDetail = Awaited<ReturnType<typeof requestGetPillDetail>>;

const cache = new Map<string, { data: RemoteDetail; expiresAt: number }>();
const pending = new Map<string, Promise<RemoteDetail>>();

// 화면 재진입 시 최근 문서는 재사용하고 같은 품목의 동시 요청을 합친다.
export const pillDetailCache = {
  get(
    itemSeq: string,
    fetch: typeof requestGetPillDetail,
  ): Promise<RemoteDetail> {
    const cached = cache.get(itemSeq);
    if (cached && cached.expiresAt > Date.now()) {
      cache.delete(itemSeq);
      cache.set(itemSeq, cached);
      return Promise.resolve(cached.data);
    }
    cache.delete(itemSeq);
    const existing = pending.get(itemSeq);
    if (existing) return existing;

    const request = fetch(itemSeq)
      .then((data) => {
        if (cache.size >= REMOTE_DETAIL_CACHE_LIMIT)
          cache.delete(cache.keys().next().value!);
        cache.set(itemSeq, {
          data,
          expiresAt: Date.now() + REMOTE_DETAIL_CACHE_TTL_MS,
        });
        return data;
      })
      .finally(() => {
        pending.delete(itemSeq);
      });
    pending.set(itemSeq, request);
    return request;
  },
};
