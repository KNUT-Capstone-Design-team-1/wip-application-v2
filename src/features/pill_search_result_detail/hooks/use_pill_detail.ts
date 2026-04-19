import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPillDetail } from '@features/pill_search_result_detail/types/pill_detail_type';
import { getPillDatasByItemSeq } from '@services/database/queries/pill_data';
import { requestGetPillDetail } from '@services/apis/google_cloud/wip_pill_detail';

export const usePillDetail = () => {
  const recentSearch = async (pillDetailData: IPillDetail) => {
    try {
      const recentSearchData = await AsyncStorage.getItem('recentSearch');
      const savedList: IPillDetail[] = recentSearchData
        ? JSON.parse(recentSearchData)
        : [];

      // 데이터 정제 - JSON 파싱 에러 방지
      const sanitizedData: IPillDetail = {};
      Object.keys(pillDetailData).forEach((key) => {
        const value = pillDetailData[key];
        if (typeof value === 'string') {
          // 개행문자, 탭, 제어문자 등을 공백으로 치환하고 trim
          sanitizedData[key] = value
            .replace(/[\r\n\t]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        } else {
          sanitizedData[key] = value;
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

  const loadPillDetail = async (itemSeq: string, setLoading, setPillData) => {
    try {
      setLoading(true);
      // 로컬 DB에서 기본 정보 먼저 가져오기 (빠름)
      const basicData = await getPillDatasByItemSeq([itemSeq]);

      if (basicData.length > 0) {
        // 기본 정보 먼저 표시
        setPillData(basicData[0] as any);
        setLoading(false);

        // 상세 정보(효능/효과, 용법/용량 등)는 백그라운드에서 가져오기
        try {
          const detailData = await requestGetPillDetail(itemSeq);
          setPillData(detailData);
        } catch (error) {
          console.log('상세 정보 로드 실패, 기본 정보만 표시', error);
        }
      } else {
        // DB에 없으면 API 호출
        const detail = await requestGetPillDetail(itemSeq);
        setPillData(detail);
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
