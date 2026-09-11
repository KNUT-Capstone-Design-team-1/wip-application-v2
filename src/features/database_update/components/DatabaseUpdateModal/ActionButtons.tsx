import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../../styles/DatabaseUpdateModal.styles';

// 업데이트 모달 취소/확인 액션 버튼 컴포넌트
export const ActionButtons = ({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <View style={styles.buttonContainer}>
    <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
      <BaseText size={16} weight="bold" style={styles.cancelButtonText}>
        다음에
      </BaseText>
    </TouchableOpacity>

    <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
      <BaseText size={16} weight="bold" style={styles.confirmButtonText}>
        업데이트
      </BaseText>
    </TouchableOpacity>
  </View>
);
