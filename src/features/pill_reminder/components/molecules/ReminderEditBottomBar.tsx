import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { px } from '@utils/responsive';
import { styles } from '@features/pill_reminder/styles/molecules/ReminderEditBottomBar';

interface IReminderEditBottomBarProps {
  selectedCount: number;
  onDelete: () => void;
}

// 복용 알림 편집 모드 하단 선택 삭제 바 컴포넌트
export const ReminderEditBottomBar = memo(
  ({ selectedCount, onDelete }: IReminderEditBottomBarProps) => {
    const insets = useSafeAreaInsets();
    const isDisabled = selectedCount === 0;

    return (
      <View
        style={[styles.container, { paddingBottom: insets.bottom + px(12) }]}
      >
        <BaseText weight="bold" size={14} style={styles.countText}>
          {selectedCount}개 선택됨
        </BaseText>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.deleteButton, isDisabled && styles.disabledButton]}
            onPress={onDelete}
            disabled={isDisabled}
            activeOpacity={0.7}
          >
            <BaseText
              weight="bold"
              style={isDisabled ? styles.disabledText : styles.deleteText}
            >
              삭제
            </BaseText>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

ReminderEditBottomBar.displayName = 'ReminderEditBottomBar';
