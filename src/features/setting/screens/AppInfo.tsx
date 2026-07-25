import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { screenPadding } from '@constants/size';
import { COLOR_BG } from '@constants/color';
import { px } from '@utils/responsive';
import { VersionList } from '../components/VersionList';

// 설정 > 앱 정보 페이지의 메인 화면 레이아웃 컴포넌트
const AppInfo = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <VersionList />
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
});

export default AppInfo;
