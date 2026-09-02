import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/pill_reminder/styles/molecules/TimePickerModalFooter';

interface ITimePickerModalFooterProps {
  onClose: () => void;
  onConfirm: () => void;
}

// 복용 시간 선택 모달 하단 버튼 컴포넌트
export const TimePickerModalFooter = memo(
  ({ onClose, onConfirm }: ITimePickerModalFooterProps) => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <BaseText size={16} weight="semiBold" style={styles.cancelText}>
            취소
          </BaseText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={onConfirm}
          activeOpacity={0.7}
        >
          <BaseText size={16} weight="bold" style={styles.confirmText}>
            완료
          </BaseText>
        </TouchableOpacity>
      </View>
    );
  },
);

TimePickerModalFooter.displayName = 'TimePickerModalFooter';
