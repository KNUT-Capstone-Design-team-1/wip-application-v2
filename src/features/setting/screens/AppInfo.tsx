import React from 'react';
import { ScrollView } from 'react-native';
import { VersionList } from '../components/VersionList';
import { styles } from '../styles/screens/AppInfo';

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

export default AppInfo;
