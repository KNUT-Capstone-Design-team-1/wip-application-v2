import React from 'react';
import { View, StyleSheet } from 'react-native';
import LastSearchPill from '../components/organisms/LastSearchPill';
import { COLOR_GRAY } from '../../../constants';
import MenuList from '../components/organisms/MenuList';
import TakeGuide from '../components/organisms/TakeGuide';

const HomeScreen: React.FC = () => {
  const dummyData = [
    '칼산탄정',
    '올메르플러정',
    '온글라이자정',
    '실버셉트오디정',
    '펜폴캡슐',
  ];

  return (
    <View style={styles.container}>
      <LastSearchPill lastSearchPillData={dummyData} />
      <View style={styles.hr}></View>
      <MenuList />
      <TakeGuide />
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
