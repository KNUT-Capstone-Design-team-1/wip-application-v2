import React, { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { Bell } from 'lucide-react-native';
import { COLOR, COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { formatReminderTime } from '@features/pill_reminder/utils/reminder_format';
import { styles } from '@features/pill_reminder/styles/atoms/ReminderTimeHeader';

interface IReminderTimeHeaderProps {
  time?: string;
  times?: string[];
  daysText: string;
  isEnabled: boolean;
}

// 알림 카드 상단 시간 및 요일 뱃지 컴포넌트 (오전/오후 표시)
export const ReminderTimeHeader = memo(
  ({ time, times, daysText, isEnabled }: IReminderTimeHeaderProps) => {
    const effectiveTimes =
      times && times.length > 0 ? times : time ? [time] : [];

    const formattedTimeStr =
      effectiveTimes.length > 0
        ? effectiveTimes.map((t) => formatReminderTime(t)).join(', ')
        : '';

    return (
      <View style={styles.container}>
        <Bell
          size={fontPx(16)}
          color={isEnabled ? COLOR.primary : COLOR_TEXT.disabled}
          style={styles.bellIcon}
        />
        <BaseText
          size={16}
          weight="bold"
          style={isEnabled ? styles.timeText : styles.timeTextDisabled}
        >
          {formattedTimeStr}
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
