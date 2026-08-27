import React from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/pill_save/styles/PillSave';

// 저장된 전체 알약 개수를 표시하는 헤더 컴포넌트
export const PillSaveCountHeader = ({ count }: { count: number }) => (
  <View style={styles.header}>
    <BaseText size={14} weight="semiBold" style={styles.countText}>
      전체 개수 {count}
    </BaseText>
  </View>
);
