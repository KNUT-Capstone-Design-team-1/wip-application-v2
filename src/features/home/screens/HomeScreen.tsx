import React from 'react';
import { View } from 'react-native';
import { styles } from '../styles/HomeScreen';
import LastViewedPill from '../components/organisms/LastViewedPill';
import MenuList from '../components/organisms/MenuList';
import TakeGuide from '../components/organisms/TakeGuide';

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <LastViewedPill />
      <MenuList />
      <TakeGuide />
    </View>
  );
};

export default HomeScreen;
