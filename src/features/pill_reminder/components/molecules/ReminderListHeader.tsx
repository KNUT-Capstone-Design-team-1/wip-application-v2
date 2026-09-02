import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { SquarePen } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { styles } from '@features/pill_reminder/styles/molecules/ReminderListHeader';

interface IReminderListHeaderProps {
  count: number;
  isEditing: boolean;
  allSelected: boolean;
  onToggleEdit: () => void;
  onSelectAll: () => void;
}

// 복용 알림 목록 헤더 컴포넌트 (알약 보관함과 동일한 UX)
export const ReminderListHeader = memo(
  ({
    count,
    isEditing,
    allSelected,
    onToggleEdit,
    onSelectAll,
  }: IReminderListHeaderProps) => {
    return (
      <View style={styles.header}>
        <BaseText size={14} weight="semiBold" style={styles.countText}>
          총 {count}개
        </BaseText>

        {isEditing ? (
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={onSelectAll} activeOpacity={0.7}>
              <BaseText size={14} weight="medium" style={styles.actionText}>
                {allSelected ? '전체해제' : '전체선택'}
              </BaseText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onToggleEdit} activeOpacity={0.7}>
              <BaseText size={14} weight="bold" style={styles.actionText}>
                완료
              </BaseText>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={onToggleEdit} activeOpacity={0.7}>
            <SquarePen size={fontPx(20)} color={COLOR_TEXT.sub} />
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

ReminderListHeader.displayName = 'ReminderListHeader';
