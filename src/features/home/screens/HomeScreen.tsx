import React, { useEffect } from 'react';
import { View } from 'react-native';
import { styles } from '../styles/HomeScreen';
import LastSearchPill from '../components/organisms/LastSearchPill';
import MenuList from '../components/organisms/MenuList';
import TakeGuide from '../components/organisms/TakeGuide';
import { useHome } from '../hooks/useHome';
import { useRouter } from 'expo-router';

const HomeScreen: React.FC = () => {
  const router = useRouter();

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
      <MenuList
        onPillIdentificationPress={() =>
          router.push('/pill-identification-search')
        }
      />
      <TakeGuide />
    </View>
  );
};

export default HomeScreen;
