import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { X } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { styles } from '@features/pill_reminder/styles/molecules/SpecificReminderHeader';

interface ISpecificReminderHeaderProps {
  itemName: string;
  onClose: () => void;
}

// 특정 알약 복용 알림 바텀시트 상단 헤더 컴포넌트
export const SpecificReminderHeader = memo(
  ({ itemName, onClose }: ISpecificReminderHeaderProps) => {
    return (
      <>
        {/* 드래그 바 */}
        <View style={styles.dragBarContainer}>
          <View style={styles.dragBar} />
        </View>

        {/* 헤더 */}
        <View style={styles.header}>
          <BaseText
            size={18}
            weight="bold"
            style={styles.title}
            numberOfLines={1}
          >
            {itemName} 복용 알림
          </BaseText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={fontPx(22)} color={COLOR_TEXT.sub} />
          </TouchableOpacity>
        </View>
      </>
    );
  },
);

SpecificReminderHeader.displayName = 'SpecificReminderHeader';
