import { useCallback } from 'react';
import { IPillDetail } from '@features/pill_search_result_detail/types/pill_detail_type';
import { getPillDatasByItemSeq } from '@services/database/queries/pill_data';
import { requestGetPillDetail } from '@services/apis/google_cloud/wip_pill_detail';
import {
  getDrivingWarningKeywords,
  checkSpecialClassifications,
} from '../services/special_classification_service';
import logger from '@utils/logger';

/**
 * 상세 정보 API 호출
 */
const fetchApiDetailData = async (itemSeq: string) => {
  try {
    const pillDetail = await requestGetPillDetail(itemSeq);

    return pillDetail;
  } catch (e) {
    logger.error(`Failed to load API pill detail. ${e.stack || e}`);

    return null;
  }
};

/**
 * API 호출 결과를 기존 상태에 병합
 * @param apiDetailData API로 부터 받은 상세 정보
 * @param setPillData 상태 업데이트 함수
 * @returns
 */
const applyApiDetailData = (
  apiDetailData: Partial<IPillDetail> | null,
  setPillData: React.Dispatch<React.SetStateAction<IPillDetail | null>>,
) => {
  if (!apiDetailData) {
    return;
  }

  const drivingWarningKeywords = getDrivingWarningKeywords(
    apiDetailData.EE_DOC_DATA,
    apiDetailData.UD_DOC_DATA,
    apiDetailData.NB_DOC_DATA,
  );

  const isDrivingWarning = drivingWarningKeywords.length > 0;

  // 조회된 상세 정보와 운전 경고 여부를 기존 데이터에 업데이트
  setPillData((prevData) =>
    prevData
      ? {
          ...prevData,
          ...apiDetailData,
          isDrivingWarning,
          drivingWarningKeywords,
        }
      : null,
  );
};

export const usePillDetail = () => {
  const loadPillDetail = useCallback(
    async (
      itemSeq: string,
      setLoading: (loading: boolean) => void,
      setPillData: React.Dispatch<React.SetStateAction<IPillDetail | null>>,
    ) => {
      try {
        setLoading(true);

        // 로컬 DB에서 기본 정보 가져오기
        const localPillDataList = await getPillDatasByItemSeq([itemSeq]);
        const basicPillData =
          localPillDataList.length > 0 ? localPillDataList[0] : null;

        if (!basicPillData) {
          setLoading(false);
          return;
        }

        // 기본 정보를 바탕으로 특수 분류 정보 계산
        const specialClassifications = await checkSpecialClassifications(
          basicPillData.MAIN_ITEM_INGR?.replace(/[^가-힣]/g, '') || '',
          basicPillData.MATERIAL_ENG_NAME || '',
        );

        // DB 정보 + 특수 분류 정보를 합쳐서 상태에 반영하여 화면에 우선 표시
        const combinedBasicData = {
          ...basicPillData,
          ...specialClassifications,
        };
        setPillData(combinedBasicData as IPillDetail);
        setLoading(false);

        // API를 통해 상세 정보 (효능효과, 용법용량, 주의사항) 백그라운드 요청
        fetchApiDetailData(itemSeq).then((apiDetailData) =>
          applyApiDetailData(apiDetailData, setPillData),
        );
      } catch (e) {
        logger.error(
          `Failed to load pill detail. ${e instanceof Error ? e.stack : e}`,
        );

        setLoading(false);
      }
    },
    [],
  );

  return { loadPillDetail };
};
