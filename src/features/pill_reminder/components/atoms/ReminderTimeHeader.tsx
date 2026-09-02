import React, { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { Bell } from 'lucide-react-native';
import { COLOR, COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { styles } from '@features/pill_reminder/styles/atoms/ReminderTimeHeader';

interface IReminderTimeHeaderProps {
  time: string;
  daysText: string;
  isEnabled: boolean;
}

// 알림 카드 상단 시간 및 요일 뱃지 컴포넌트
export const ReminderTimeHeader = memo(
  ({ time, daysText, isEnabled }: IReminderTimeHeaderProps) => {
    return (
      <View style={styles.container}>
        <Bell
          size={fontPx(16)}
          color={isEnabled ? COLOR.primary : COLOR_TEXT.disabled}
          style={styles.bellIcon}
        />
        <BaseText
          size={18}
          weight="bold"
          style={isEnabled ? styles.timeText : styles.disabledText}
        >
          {time}
        </BaseText>
        <View style={styles.dayBadge}>
          <BaseText
            size={12}
            weight="semiBold"
            style={isEnabled ? styles.dayBadgeText : styles.disabledText}
          >
            {daysText}
          </BaseText>
        </View>
      </View>
    );
  },
);

ReminderTimeHeader.displayName = 'ReminderTimeHeader';
