import React, { useEffect } from 'react';
import { View } from 'react-native';
import { styles } from '../styles/HomeScreen';
import LastViewedPill from '../components/organisms/LastViewedPill';
import MenuList from '../components/organisms/MenuList';
import TakeGuide from '../components/organisms/TakeGuide';
import { useAppTrackStore } from '@store/app_track_store';

const HomeScreen: React.FC = () => {
  const increaseAppLaunchCount = useAppTrackStore(
    (state) => state.increaseAppLaunchCount,
  );

  // 앱 실행 횟수 증가
  useEffect(() => {
    increaseAppLaunchCount();
  }, []);

  return (
    <View style={styles.container}>
      <LastViewedPill />
      <MenuList />
      <TakeGuide />
    </View>
  );
};

export default HomeScreen;
