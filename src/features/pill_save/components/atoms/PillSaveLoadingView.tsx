import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/pill_save/styles/PillSave';
import { COLOR } from '@constants/color';

// 데이터 로딩 시 표시되는 공통 스피너 컴포넌트
export const PillSaveLoadingView = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLOR['primary']} />
    <BaseText size={16} weight="bold" style={styles.loadingText}>
      데이터를 불러오는 중...
    </BaseText>
  </View>
);
