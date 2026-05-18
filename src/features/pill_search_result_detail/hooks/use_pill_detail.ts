import AsyncStorage from '@react-native-async-storage/async-storage';
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
   * 데이터 정제 - JSON 파싱 에러 방지
   */
  const sanitizePillDetailData = (data: IPillDetail): IPillDetail => {
    return Object.entries(data).reduce((acc, [key, value]) => {
      const typedKey = key as keyof IPillDetail;

      // 개행문자, 탭, 제어문자 등을 공백으로 치환하고 trim
      if (typeof value === 'string') {
        return {
          ...acc,
          [typedKey]: value
            .replace(/[\r\n\t]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim(),
        };
      }

      return { ...acc, [typedKey]: value };
    }, {} as IPillDetail);
  };

  /**
   * 최근 검색한 알약 정보를 로컬 스토리지에 저장
   */
  const recentSearch = async (pillDetailData: IPillDetail) => {
    try {
      const recentSearchData = await AsyncStorage.getItem('recentSearch');

      const savedList: IPillDetail[] = recentSearchData
        ? JSON.parse(recentSearchData)
        : [];

      const sanitizedData = sanitizePillDetailData(pillDetailData);

      // 중복 제거 (이미 있으면 제거)
      const filteredList = savedList.filter(
        (item: IPillDetail) => item.ITEM_SEQ !== sanitizedData.ITEM_SEQ,
      );

      const updateList = [sanitizedData, ...filteredList]; // 최근 항목을 맨 앞에 추가

      if (updateList.length > 7) {
        updateList.pop();
      }

      await AsyncStorage.setItem('recentSearch', JSON.stringify(updateList));
    } catch (e) {
      logger.error(`Failed to save recent search. ${e.stack || e}`);
    }
  };

  /**
   * 백그라운드에서 상세 정보를 불러와 기존 기본 정보와 병합
   */
  const fetchBackgroundDetail = async (
    itemSeq: string,
    setPillData: React.Dispatch<React.SetStateAction<IPillDetail | null>>,
  ) => {
    try {
      const detailData = await requestGetPillDetail(itemSeq);

      // 운전 주의 여부 확인
      const isDrivingWarning = checkDrivingWarning(
        detailData.EE_DOC_DATA,
        detailData.UD_DOC_DATA,
        detailData.NB_DOC_DATA,
      );

      // 데이터 병합 (기본 정보 + 상세 정보 + 추가 분석 정보)
      setPillData((prev) => ({ ...prev, ...detailData, isDrivingWarning }));
    } catch (e: any) {
      logger.error(`Failed to load background pill detail. ${e.stack || e}`);
    }
  };

  /**
   * 로컬 DB에 기본 정보가 없을 경우, API에서 전체 상세 정보를 로드
   */
  const fetchDetailFromApi = async (
    itemSeq: string,
    setPillData: React.Dispatch<React.SetStateAction<IPillDetail | null>>,
  ) => {
    const detail = await requestGetPillDetail(itemSeq);

    const classifications = checkSpecialClassifications(
      detail.MATERIAL_NAME || '',
      detail.MAIN_INGR_ENG || '',
    );

    const drivingWarning = checkDrivingWarning(
      detail.EE_DOC_DATA,
      detail.UD_DOC_DATA,
      detail.NB_DOC_DATA,
    );

    const [specialInfo, isDrivingWarning] = await Promise.all([
      classifications,
      drivingWarning,
    ]);

    setPillData({ ...detail, ...specialInfo, isDrivingWarning });
  };

  /**
   * 로컬 DB에서 찾은 기본 정보에 특수 분류를 추가하여 먼저 보여주고, 상세 정보를 백그라운드로 요청
   */
  const processBasicData = async (
    itemSeq: string,
    basicData: any,
    setPillData: React.Dispatch<React.SetStateAction<IPillDetail | null>>,
  ) => {
    // 기본 특수 분류 확인
    const specialInfo = await checkSpecialClassifications(
      basicData.MATERIAL_NAME || '',
      basicData.MATERIAL_ENG_NAME || '',
    );

    const initialData = { ...basicData, ...specialInfo };

    setPillData(initialData); // 기본 정보 먼저 표시

    fetchBackgroundDetail(itemSeq, setPillData); // 상세 정보(효능/효과, 용법/용량 등)는 백그라운드에서 가져오기
  };

  /**
   * 알약의 기본 정보를 로컬 DB에서 가져오고, 필요한 경우 API를 통해 상세 정보를 로드
   */
  const loadPillDetail = async (
    itemSeq: string,
    setLoading: (loading: boolean) => void,
    setPillData: React.Dispatch<React.SetStateAction<IPillDetail | null>>,
  ) => {
    try {
      setLoading(true);

      // 로컬 DB에서 기본 정보 먼저 가져오기
      const basicDataList = await getPillDatasByItemSeq([itemSeq]);
      const basicData = basicDataList.length > 0 ? basicDataList[0] : null;

      // DB에 없으면 API 호출 후 조기 종료
      if (!basicData) {
        await fetchDetailFromApi(itemSeq, setPillData);
        return;
      }

      await processBasicData(itemSeq, basicData, setPillData);
    } catch (e: any) {
      logger.error(`Failed to load pill detail. ${e.stack || e}`);
    } finally {
      setLoading(false);
    }
  };

  return { recentSearch, loadPillDetail };
};
