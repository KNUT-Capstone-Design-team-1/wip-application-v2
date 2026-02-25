import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPillDetail } from '@/src/features/pill_search_result_detail/types/pill_detail_type';

export const usePillDetail = () => {
  const recentSearch = async (pillDetailData: IPillDetail) => {
    try {
      const recentSearchData = await AsyncStorage.getItem('recentSearch');
      const savedList: IPillDetail[] = recentSearchData ? JSON.parse(recentSearchData) : [];

      // 데이터 정제 - JSON 파싱 에러 방지
      const sanitizedData: IPillDetail = {};
      Object.keys(pillDetailData).forEach((key) => {
        const value = pillDetailData[key];
        if (typeof value === 'string') {
          // 개행문자, 탭, 제어문자 등을 공백으로 치환하고 trim
          sanitizedData[key] = value.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
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

      await AsyncStorage.setItem('recentSearch', JSON.stringify(updateList));
    } catch (error) {
      console.error('❌ Failed to save recent search:', error);
    }
  };

  return {
    recentSearch,
  };
};
