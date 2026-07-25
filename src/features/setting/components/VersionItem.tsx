import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLOR_TEXT, COLOR } from '@constants/color';
import { px } from '@utils/responsive';
import { BaseText } from '@components/common/BaseText';

interface VersionItemProps {
  label: string;
  value: string;
}

// 버전 정보를 표시하는 공통 2줄 리스트 아이템 컴포넌트
export const VersionItem = ({ label, value }: VersionItemProps) => {
  return (
    <View style={styles.itemContainer}>
      <BaseText weight="medium" size={16} style={styles.label}>
        {label}
      </BaseText>
      <BaseText weight="medium" size={14} style={styles.value}>
        {value}
      </BaseText>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: px(16),
    justifyContent: 'center',
  },
  label: {
    color: COLOR_TEXT['title'],
    marginBottom: px(4),
  },
  value: {
    color: COLOR.primary,
  },
});
