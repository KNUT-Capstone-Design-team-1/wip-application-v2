import type {
  PillDetailLoadService,
  PillDetailStore,
} from '../types/pill_detail_type';

// 기본·원격 정보 순차 로딩과 오래된 응답 차단.
export const createPillDetailLoader = (
  store: PillDetailStore,
  service: PillDetailLoadService,
) => {
  let sequence = 0;

  // 화면 이탈·재조회 시 진행 중 응답 무효화.
  const cancel = () => {
    sequence++;
  };

  // 기본 정보 우선 표시 후 상세 문서 병합.
  const load = async () => {
    const request = ++sequence;
    const { itemSeq, setPillData, setLoading, setDetailLoading } =
      store.getState();
    setPillData(null);
    setLoading(true);
    setDetailLoading(true);

    try {
      if (!itemSeq) {
        return;
      }

      const basic = await service.getBasicDetail(itemSeq);

      if (request !== sequence || !basic) {
        return;
      }

      setPillData(basic);
      setLoading(false);
      const remote = await service.getRemoteDetail(itemSeq);

      if (request !== sequence || !remote) {
        return;
      }

      setPillData({ ...basic, ...remote });
    } finally {
      if (request === sequence) {
        setLoading(false);
        setDetailLoading(false);
      }
    }
  };

  return { load, cancel };
};
