import React from 'react';
import { TouchableOpacity, Text, Linking } from 'react-native';
import { useSearchResultListStore } from '../../store/search_result_list_store';
import { useExternalUrlStore } from '../../../../store/external_url_store';
import { styles } from '../../styles/atoms/HealthKrFloatingButton';
import SearchIcon from '../../../../../assets/icons/search.svg';
import { mapToHealthKrUrl } from '../../utils/health_kr_mapper';

const HealthKrFloatingButton = () => {
  const searchParam = useSearchResultListStore((state) => state.searchParam);
  const healthKrUrl = useExternalUrlStore((state) => state.healthKrUrl);

  const handlePress = async () => {
    try {
      // mapToHealthKrUrl 내부에서 경로 중복 처리를 하므로 직접 URL 생성
      const url = mapToHealthKrUrl(searchParam || {}, healthKrUrl);
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open Health.kr URL:', error);
    }
  };

  return (
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <SearchIcon width={18} height={18} fill="#fff" />
      <Text style={styles.buttonText}>검색 결과에 없는 약 검색</Text>
    </TouchableOpacity>
  );
};

export default HealthKrFloatingButton;
