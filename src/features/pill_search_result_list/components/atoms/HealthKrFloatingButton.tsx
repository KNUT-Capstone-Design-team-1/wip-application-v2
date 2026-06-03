import React from 'react';
import { TouchableOpacity, Text, Linking } from 'react-native';
import { useSearchResultListStore } from '@features/pill_search_result_list/store/search_result_list_store';
import { useExternalUrlStore } from '@store/external_url_store';
import { styles } from '@features/pill_search_result_list/styles/atoms/HealthKrFloatingButton';
import SearchIcon from '@assets/icons/search.svg';
import { mapToHealthKrUrl } from '@features/pill_search_result_list/utils/health_kr_mapper';
import logger from '@utils/logger';
import { Search } from 'lucide-react-native';
import { COLOR } from '@constants/color';

const HealthKrFloatingButton = () => {
  const searchParam = useSearchResultListStore((state) => state.searchParam);
  const healthKrUrl = useExternalUrlStore((state) => state.healthKrUrl);

  const handlePress = async () => {
    try {
      // mapToHealthKrUrl 내부에서 경로 중복 처리를 하므로 직접 URL 생성
      const url = mapToHealthKrUrl(searchParam || {}, healthKrUrl);

      await Linking.openURL(url);
    } catch (e) {
      logger.error(`Failed to open Health.kr URL. ${e.stack || e}`);
    }
  };

  return (
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Search size={18} color={COLOR['white']} strokeWidth={2} />
      <Text style={styles.buttonText}>검색 결과에 없는 약 검색</Text>
    </TouchableOpacity>
  );
};

export default HealthKrFloatingButton;
