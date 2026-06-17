import { useCallback } from 'react';
import { IPillDetail } from '@features/pill_search_result_detail/types/pill_detail_type';
import { getPillDatasByItemSeq } from '@services/database/queries/pill_data';
import { requestGetPillDetail } from '@services/apis/google_cloud/wip_pill_detail';
import {
  checkDrivingWarning,
  checkSpecialClassifications,
} from '../services/special_classification_service';
import logger from '@utils/logger';

export const usePillDetail = () => {
  /**
   * 백그라운드에서 상세 정보를 불러와 기존 기본 정보와 병합
   */
  const fetchBackgroundDetail = useCallback(
    async (
      itemSeq: string,
      setPillData: React.Dispatch<React.SetStateAction<IPillDetail | null>>,
    ) => {
      try {
        const detailData = await requestGetPillDetail(itemSeq);

        const isDrivingWarning = checkDrivingWarning(
          detailData.EE_DOC_DATA,
          detailData.UD_DOC_DATA,
          detailData.NB_DOC_DATA,
        );

        setPillData((prev) =>
          prev ? { ...prev, ...detailData, isDrivingWarning } : null,
        );
      } catch (e) {
        logger.error(`Failed to load background pill detail. ${e.stack || e}`);
      }
    },
    [],
  );

  /**
   * 로컬 DB에 기본 정보가 없을 경우, API에서 전체 상세 정보를 로드
   */
  const fetchDetailFromApi = useCallback(
    async (
      itemSeq: string,
      setPillData: React.Dispatch<React.SetStateAction<IPillDetail | null>>,
    ) => {
      try {
        const detail = await requestGetPillDetail(itemSeq);

        const [classifications, drivingWarning] = await Promise.all([
          checkSpecialClassifications(
            detail.MAIN_ITEM_INGR?.replace(/[^가-힣]/g, '') || '',
            detail.MAIN_INGR_ENG || '',
          ),
          checkDrivingWarning(
            detail.EE_DOC_DATA,
            detail.UD_DOC_DATA,
            detail.NB_DOC_DATA,
          ),
        ]);

        setPillData({
          ...detail,
          ...classifications,
          isDrivingWarning: drivingWarning,
        });
      } catch (e) {
        logger.error(`Failed to fetch detail from API. ${e.stack || e}`);
      }
    },
    [],
  );

  /**
   * 로컬 DB에서 찾은 기본 정보에 특수 분류를 추가하여 먼저 보여주고, 상세 정보를 백그라운드로 요청
   */
  const processBasicData = useCallback(
    async (
      itemSeq: string,
      basicData: any,
      setPillData: React.Dispatch<React.SetStateAction<IPillDetail | null>>,
    ) => {
      const specialInfo = await checkSpecialClassifications(
        basicData.MAIN_ITEM_INGR?.replace(/[^가-힣]/g, '') || '',
        basicData.MATERIAL_ENG_NAME || '',
      );

      setPillData({ ...basicData, ...specialInfo });
      await fetchBackgroundDetail(itemSeq, setPillData);
    },
    [fetchBackgroundDetail],
  );

  /**
   * 알약의 기본 정보를 로컬 DB에서 가져오고, 필요한 경우 API를 통해 상세 정보를 로드
   */
  const loadPillDetail = useCallback(
    async (
      itemSeq: string,
      setLoading: (loading: boolean) => void,
      setPillData: React.Dispatch<React.SetStateAction<IPillDetail | null>>,
    ) => {
      try {
        setLoading(true);

        const basicDataList = await getPillDatasByItemSeq([itemSeq]);
        const basicData = basicDataList.length > 0 ? basicDataList[0] : null;

        if (!basicData) {
          await fetchDetailFromApi(itemSeq, setPillData);
          return;
        }

        await processBasicData(itemSeq, basicData, setPillData);
      } catch (e) {
        logger.error(`Failed to load pill detail. ${e.stack || e}`);
      } finally {
        setLoading(false);
      }
    },
    [fetchDetailFromApi, processBasicData],
  );

  return { loadPillDetail };
};
