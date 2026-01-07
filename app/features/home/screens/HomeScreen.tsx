import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import homeScreenStyles from '../styles/home_screen';

const HomeScreen: React.FC = () => {
  const router = useRouter();

  return <View style={homeScreenStyles.container}></View>;
};

export default HomeScreen;
