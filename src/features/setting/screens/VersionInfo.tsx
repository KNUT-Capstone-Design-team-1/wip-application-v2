import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { screenPadding } from '@constants/size';
import { COLOR_BG } from '@constants/color';
import { px } from '@utils/responsive';
import { AppVersionSection } from '../components/AppVersionSection';
import { DatabaseVersionSection } from '../components/DatabaseVersionSection';

// 설정 > 버전 정보 페이지의 메인 화면 레이아웃 컴포넌트
const VersionInfo = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <AppVersionSection />
      <View style={styles.sectionDivider} />
      <DatabaseVersionSection />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_BG['surface'],
  },
  contentContainer: {
    paddingHorizontal: screenPadding.horizontal,
    paddingTop: screenPadding.top,
    paddingBottom: px(40),
  },
  sectionDivider: {
    height: px(8),
    backgroundColor: COLOR_BG['base'],
    marginHorizontal: -screenPadding.horizontal,
    marginVertical: px(16),
  },
});

export default VersionInfo;
