import type {
  PillDetailLoadService,
  PillDetailStore,
} from '../types/pill_detail_type';

// 기본·원격 정보 순차 갱신과 오래된 응답 차단.
export const createPillDetailLoader = (
  store: PillDetailStore,
  service: PillDetailLoadService,
) => {
  let sequence = 0;

  // 화면 이탈·재조회 시 진행 중 응답 무효화.
  const cancel = () => {
    sequence++;
  };

  const load = async () => {
    const request = ++sequence;

    const { itemSeq, pillData, setPillData, setLoading, setDetailLoading } =
      store.getState();

    const hasExistingData = !!pillData && pillData.ITEM_SEQ === itemSeq;
    const isInitialLoad = !hasExistingData;

    // 재진입 시 기존 화면을 유지해 스크롤·펼침·검색 상태를 보존한다.
    if (isInitialLoad) {
      setPillData(null);
      setLoading(true);
      setDetailLoading(true);
    }

    try {
      const hasItemSeq = !!itemSeq;

      if (!hasItemSeq) {
        return;
      }

      const basic = await service.getBasicDetail(itemSeq);

      const isStaleBasic =
        request !== sequence || store.getState().itemSeq !== itemSeq;
      const hasBasic = !!basic;

      if (isStaleBasic || !hasBasic) {
        return;
      }

      // 로컬 DB 정보는 갱신하고 기존 원격 문서는 응답이 올 때까지 유지한다.
      const updated = hasExistingData ? { ...pillData, ...basic } : basic;

      setPillData(updated);
      setLoading(false);

      const remote = await service.getRemoteDetail(itemSeq);

      const isStaleRemote =
        request !== sequence || store.getState().itemSeq !== itemSeq;
      const hasRemote = !!remote;

      if (isStaleRemote || !hasRemote) {
        return;
      }

      setPillData({ ...updated, ...remote });
    } finally {
      const isCurrentRequest =
        request === sequence && store.getState().itemSeq === itemSeq;

      if (isCurrentRequest) {
        setLoading(false);
        setDetailLoading(false);
      }
    }
  };

  return { load, cancel };
};
