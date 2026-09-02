import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { X } from 'lucide-react-native';
import { fontPx } from '@utils/responsive';
import { COLOR_TEXT } from '@constants/color';
import { styles } from '@features/pill_reminder/styles/molecules/PillReminderSelectHeader';

interface IPillReminderSelectHeaderProps {
  hasPills: boolean;
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  onClose: () => void;
}

// 알약 선택 모달 상단 헤더 컴포넌트
export const PillReminderSelectHeader = memo(
  ({
    hasPills,
    isAllSelected,
    onToggleSelectAll,
    onClose,
  }: IPillReminderSelectHeaderProps) => {
    return (
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BaseText size={18} weight="bold" style={styles.title}>
            알약 선택하기
          </BaseText>
        </View>

        <View style={styles.headerRight}>
          {hasPills && (
            <TouchableOpacity
              onPress={onToggleSelectAll}
              style={styles.selectAllBtn}
              activeOpacity={0.7}
            >
              <BaseText
                size={14}
                weight="semiBold"
                style={styles.selectAllText}
              >
                {isAllSelected ? '전체해제' : '전체선택'}
              </BaseText>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={fontPx(22)} color={COLOR_TEXT.sub} />
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

PillReminderSelectHeader.displayName = 'PillReminderSelectHeader';
