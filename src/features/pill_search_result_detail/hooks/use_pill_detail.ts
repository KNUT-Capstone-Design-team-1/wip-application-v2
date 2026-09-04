import { useCallback, useState } from 'react';
import { IPillDetail } from '@features/pill_search_result_detail/types/pill_detail_type';
import { pillDetailService } from '../services/pill_detail_service';
import logger from '@utils/logger';

export const usePillDetail = () => {
  const [detailLoading, setDetailLoading] = useState(true);

  const loadPillDetail = useCallback(
    async (
      itemSeq: string,
      setLoading: (loading: boolean) => void,
      setPillData: React.Dispatch<React.SetStateAction<IPillDetail | null>>,
    ) => {
      try {
        setLoading(true);

        // 로컬 저장소에서 기본 정보와 분류 정보를 가져온다.
        const basicDetail = await pillDetailService.getBasicDetail(itemSeq);
        if (!basicDetail) {
          setLoading(false);
          return;
        }

        // 기본 정보를 먼저 화면에 표시한다.
        setPillData(basicDetail);
        setLoading(false);

        setDetailLoading(true);

        // 서버 상세 문서를 백그라운드에서 병합한다.
        pillDetailService.getRemoteDetail(itemSeq).then((remoteDetail) => {
          if (!remoteDetail) {
            setDetailLoading(false);
            return;
          }

          setPillData((prevData) =>
            prevData ? { ...prevData, ...remoteDetail } : null,
          );
          setDetailLoading(false);
        });
      } catch (e) {
        logger.error(
          `Failed to load pill detail. ${e instanceof Error ? e.stack : e}`,
        );

        setLoading(false);
      }
    },
    [],
  );

  return { loadPillDetail, detailLoading };
};
