import React, { useEffect, useState } from "react";
import { View } from 'react-native';
import { styles } from '../styles/HomeScreen';
import LastSearchPill from '../components/organisms/LastSearchPill';
import MenuList from '../components/organisms/MenuList';
import TakeGuide from '../components/organisms/TakeGuide';
import PillIdentificationSearchModal from '../../pill_identification_search/components/organisms/PillIdentificationSearchModal';
import { IPillDetail } from '../../pill_search_result_detail/types/pill_detail_type';
import { useHome } from '../hooks/use_home';

const HomeScreen: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [recentSearchPills, setRecentSearchPills] = useState<IPillDetail[]>([]);
  const { loadRecentSearchPills } = useHome();

  useEffect(() => {
    loadRecentSearchPills(setRecentSearchPills);
  }, []);

  const handleDataChange = () => {
    loadRecentSearchPills(setRecentSearchPills);
  };

  return (
    <View style={styles.container}>
      <LastSearchPill
        lastSearchPillData={recentSearchPills}
        onDataChange={handleDataChange}
      />
      <View style={styles.hr}></View>
      <MenuList onPillIdentificationPress={() => setIsModalVisible(true)} />
      <TakeGuide />

      <PillIdentificationSearchModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};

export default HomeScreen;
