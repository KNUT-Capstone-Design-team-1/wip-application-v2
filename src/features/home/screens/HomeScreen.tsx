import React from 'react';
import { View } from 'react-native';
import { styles } from '../styles/HomeScreen';
import LastViewedPill from '../components/organisms/LastViewedPill';
import MenuList from '../components/organisms/MenuList';
import TakeGuide from '../components/organisms/TakeGuide';
import { useRouter } from 'expo-router';

const HomeScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LastViewedPill />
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
