import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPillDetail } from '@features/pill_search_result_detail/types/pill_detail_type';
import { getPillDatasByItemSeq } from '@services/database/queries/pill_data';
import { requestGetPillDetail } from '@services/apis/google_cloud/wip_pill_detail';
import {
  checkDrivingWarning,
  checkSpecialClassifications,
} from '../services/special_classification_service';

export const usePillDetail = () => {
  const recentSearch = async (pillDetailData: IPillDetail) => {
    try {
      const recentSearchData = await AsyncStorage.getItem('recentSearch');
      const savedList: IPillDetail[] = recentSearchData
        ? JSON.parse(recentSearchData)
        : [];

      // 데이터 정제 - JSON 파싱 에러 방지
      const sanitizedData = {} as IPillDetail;
      Object.keys(pillDetailData).forEach((key) => {
        const typedKey = key as keyof IPillDetail;
        const value = pillDetailData[typedKey];
        if (typeof value === 'string') {
          // 개행문자, 탭, 제어문자 등을 공백으로 치환하고 trim
          (sanitizedData[typedKey] as any) = value
            .replace(/[\r\n\t]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        } else {
          (sanitizedData[typedKey] as any) = value;
        }
      });

      // 중복 제거 (이미 있으면 제거)
      const filteredList = savedList.filter((item: IPillDetail) => {
        return item.ITEM_SEQ !== sanitizedData.ITEM_SEQ;
      });

      // 최근 항목을 맨 앞에 추가
      const updateList = [sanitizedData, ...filteredList];

      // 7개 초과 시 마지막 항목 제거
      if (updateList.length > 7) {
        updateList.pop();
      }

      await AsyncStorage.setItem('recentSearch', JSON.stringify(updateList));
    } catch (error) {
      console.error('❌ Failed to save recent search:', error);
    }
  };

  const loadPillDetail = async (
    itemSeq: string,
    setLoading: (loading: boolean) => void,
    setPillData: React.Dispatch<React.SetStateAction<IPillDetail | null>>,
  ) => {
    try {
      setLoading(true);
      // 로컬 DB에서 기본 정보 먼저 가져오기 (빠름)
      const basicDataList = await getPillDatasByItemSeq([itemSeq]);
      const basicData = basicDataList.length > 0 ? basicDataList[0] : null;

      if (basicData) {
        // 기본 특수 분류 확인
        const specialInfo = await checkSpecialClassifications(
          basicData.MATERIAL_NAME || '',
          basicData.MATERIAL_ENG_NAME || '',
        );

        const initialData = {
          ...basicData,
          ...specialInfo,
        } as IPillDetail;

        // 기본 정보 먼저 표시
        setPillData(initialData);
        setLoading(false);

        // 상세 정보(효능/효과, 용법/용량 등)는 백그라운드에서 가져오기
        try {
          const detailData = await requestGetPillDetail(itemSeq);

          // 운전 주의 여부 확인
          const isDrivingWarning = checkDrivingWarning(
            detailData.EE_DOC_DATA,
            detailData.UD_DOC_DATA,
            detailData.NB_DOC_DATA,
          );

          // 데이터 병합 (기본 정보 + 상세 정보 + 추가 분석 정보)
          setPillData(
            (prev) =>
              ({
                ...prev,
                ...detailData,
                isDrivingWarning,
              }) as IPillDetail,
          );
        } catch (error) {
          console.log('상세 정보 로드 실패, 기본 정보만 표시', error);
        }
      } else {
        // DB에 없으면 API 호출
        const detail = await requestGetPillDetail(itemSeq);

        const [specialInfo, isDrivingWarning] = await Promise.all([
          checkSpecialClassifications(
            detail.MATERIAL_NAME || '',
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
          ...specialInfo,
          isDrivingWarning,
        } as IPillDetail);
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to load pill detail:', error);
      setLoading(false);
    }
  };

  return {
    recentSearch,
    loadPillDetail,
  };
};
