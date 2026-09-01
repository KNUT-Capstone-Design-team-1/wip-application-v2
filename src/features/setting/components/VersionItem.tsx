import React from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../styles/components/VersionItem';

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
