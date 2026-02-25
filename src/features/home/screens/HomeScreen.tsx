import React, { useEffect, useState } from "react";
import { View, StyleSheet } from 'react-native';
import LastSearchPill from '../components/organisms/LastSearchPill';
import { COLOR_GRAY } from '../../../constants';
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

  return (
    <View style={styles.container}>
      <LastSearchPill lastSearchPillData={recentSearchPills} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  hr: {
    width: '100%',
    height: 1,
    backgroundColor: COLOR_GRAY[150],
    marginTop: 20,
  },
});

export default HomeScreen;
