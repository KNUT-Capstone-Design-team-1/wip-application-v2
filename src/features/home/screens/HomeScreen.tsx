import React from 'react';
import { View } from 'react-native';
import { styles } from '../styles/HomeScreen';
import LastSearchPill from '../components/organisms/LastSearchPill';
import MenuList from '../components/organisms/MenuList';
import TakeGuide from '../components/organisms/TakeGuide';
import { useRouter } from 'expo-router';

/*
TODO
- 뒤로 가기 완전 종료 로직 필요
*/

const HomeScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LastSearchPill />
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
