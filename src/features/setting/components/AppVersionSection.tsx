import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as Application from 'expo-application';
import { COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';
import { BaseText } from '@components/common/BaseText';
import { VersionItem } from './VersionItem';

// 현재 앱의 버전을 화면에 표시하는 컴포넌트
export const AppVersionSection = () => {
  return (
    <View style={styles.section}>
      <BaseText weight="bold" size={18} style={styles.sectionTitle}>
        앱 정보
      </BaseText>
      <VersionItem
        label="현재 앱 버전"
        value={`v${Application.nativeApplicationVersion}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: px(10),
  },
  sectionTitle: {
    color: COLOR_TEXT['title'],
    marginBottom: px(8),
  },
});
