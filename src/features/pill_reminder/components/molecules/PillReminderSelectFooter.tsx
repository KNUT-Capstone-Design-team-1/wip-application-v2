import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BaseText } from '@components/common/BaseText';
import { px } from '@utils/responsive';
import { styles } from '@features/pill_reminder/styles/molecules/PillReminderSelectFooter';

interface IPillReminderSelectFooterProps {
  selectedCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}

// 알약 선택 모달 하단 고정 액션 버튼 컴포넌트
export const PillReminderSelectFooter = memo(
  ({ selectedCount, onCancel, onConfirm }: IPillReminderSelectFooterProps) => {
    const insets = useSafeAreaInsets();
    const isConfirmDisabled = selectedCount === 0;

    return (
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, px(16)) },
        ]}
      >
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <BaseText size={16} weight="semiBold" style={styles.cancelText}>
            취소
          </BaseText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.confirmBtn, isConfirmDisabled && styles.disabledBtn]}
          onPress={onConfirm}
          disabled={isConfirmDisabled}
          activeOpacity={0.7}
        >
          <BaseText
            size={16}
            weight="bold"
            style={isConfirmDisabled ? styles.disabledText : styles.confirmText}
          >
            선택 완료 ({selectedCount})
          </BaseText>
        </TouchableOpacity>
      </View>
    );
  },
);

PillReminderSelectFooter.displayName = 'PillReminderSelectFooter';
