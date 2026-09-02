import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/pill_save/styles/molecules/PillSaveHeader';
import StockInquiryIconButton from '@features/nearby_pharmacy/components/atoms/StockInquiryIconButton';
import { SquarePen, Bell } from 'lucide-react-native';
import { fontPx } from '@utils/responsive';
import { COLOR_TEXT } from '@constants/color';
import { router } from 'expo-router';

interface Props {
  count: number;
  isEditing?: boolean;
  onToggleEdit?: () => void;
  onSelectAll?: () => void;
  allSelected?: boolean;
  onStockInquiry?: () => void;
  onReminderPress?: () => void;
}

// 저장된 전체 알약 개수를 표시하는 헤더 컴포넌트
export const PillSaveCountHeader = ({
  count,
  isEditing = false,
  onToggleEdit,
  onSelectAll,
  allSelected = false,
  onStockInquiry,
  onReminderPress,
}: Props) => {
  const handleReminder = () => {
    if (onReminderPress) {
      onReminderPress();
    } else {
      router.push('/pill-reminder');
    }
  };

  return (
    <View style={styles.header}>
      <BaseText size={14} weight="semiBold" style={styles.countText}>
        총 {count}개
      </BaseText>

      {isEditing ? (
        <TouchableOpacity onPress={onSelectAll}>
          <BaseText size={14} weight="medium" style={styles.title}>
            {allSelected ? '전체해제' : '전체선택'}
          </BaseText>
        </TouchableOpacity>
      ) : (
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleReminder}>
            <Bell size={fontPx(20)} color={COLOR_TEXT.sub} />
          </TouchableOpacity>
          {onStockInquiry && (
            <StockInquiryIconButton
              onPress={onStockInquiry}
              size={20}
              color={COLOR_TEXT.sub}
            />
          )}
          <TouchableOpacity onPress={onToggleEdit}>
            <SquarePen size={fontPx(20)} color={COLOR_TEXT.sub} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
