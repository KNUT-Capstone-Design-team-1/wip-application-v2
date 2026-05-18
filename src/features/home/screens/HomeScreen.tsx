import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { styles } from '../styles/HomeScreen';
import LastSearchPill from '../components/organisms/LastSearchPill';
import MenuList from '../components/organisms/MenuList';
import TakeGuide from '../components/organisms/TakeGuide';
import { PillIdentificationSearchModal } from '../../pill_identification_search';
import { useHome } from '../hooks/useHome';

const HomeScreen: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { recentSearchPills, loadRecentSearchPills, deleteRecentSearch } =
    useHome();

  useEffect(() => {
    loadRecentSearchPills();
  }, [loadRecentSearchPills]);

  return (
    <View style={styles.container}>
      <LastSearchPill
        lastSearchPillData={recentSearchPills}
        onDelete={deleteRecentSearch}
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
