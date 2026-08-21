import React from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { px } from '@utils/responsive';
import { styles } from '../../styles/DatabaseUpdateModal.styles';

export const WarningMessage = () => (
  <View style={styles.warningContainer}>
    <BaseText size={11} style={styles.warningText}>
      업데이트를 진행하지 않으시면 최신 정보를 확인하실 수 없습니다.
    </BaseText>
    <BaseText size={11} style={[styles.warningText, { marginTop: px(8) }]}>
      지금 바로 업데이트할까요?
    </BaseText>
  </View>
);
