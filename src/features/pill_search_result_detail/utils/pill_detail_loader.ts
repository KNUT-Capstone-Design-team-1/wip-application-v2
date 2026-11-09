import type {
  IPillDetail,
  PillDetailLoadService,
  PillDetailStore,
} from '../types/pill_detail_type';

// 기본 정보, 서버 문서, 성분 분류를 독립적으로 갱신하고 오래된 응답은 버린다.
export const createPillDetailLoader = (
  store: PillDetailStore,
  service: PillDetailLoadService,
) => {
  let sequence = 0;
  const cancel = () => {
    sequence++;
  };

  const load = async () => {
    const request = ++sequence;
    const { itemSeq, pillData } = store.getState();
    const isCurrent = () =>
      request === sequence && store.getState().itemSeq === itemSeq;
    const merge = (patch: Partial<IPillDetail> | null) => {
      if (!patch || !isCurrent()) return;
      const current = store.getState().pillData;
      if (current) store.getState().setPillData({ ...current, ...patch });
    };
    const hasExistingData = !!pillData && pillData.ITEM_SEQ === itemSeq;
    if (!hasExistingData) {
      store.setState({
        pillData: null,
        loading: true,
        detailLoading: true,
        classificationLoading: true,
      });
    }

    try {
      if (!itemSeq) return;
      // 로컬 분류의 최초 준비와 네트워크 요청을 동시에 진행한다.
      const remoteRequest = service.getRemoteDetail(itemSeq).catch(() => null);
      const basic = await service.getBasicDetail(itemSeq);
      if (!isCurrent() || !basic) return;
      store.setState({
        pillData: hasExistingData ? { ...pillData, ...basic } : basic,
        loading: false,
      });

      const results = await Promise.allSettled([
        remoteRequest.then(merge).finally(() => {
          if (isCurrent()) store.getState().setDetailLoading(false);
        }),
        service
          .getClassificationDetail(basic)
          .then(merge)
          .finally(() => {
            if (isCurrent()) store.getState().setClassificationLoading(false);
          }),
      ]);
      const failure = results.find((result) => result.status === 'rejected');
      if (failure?.status === 'rejected') throw failure.reason;
    } finally {
      if (isCurrent()) {
        store.setState({
          loading: false,
          detailLoading: false,
          classificationLoading: false,
        });
      }
    }
  };

  return { load, cancel };
};
