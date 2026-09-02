import React, { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { Bell } from 'lucide-react-native';
import { COLOR } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { formatReminderDays } from '@features/pill_reminder/utils/reminder_format';
import { styles } from '@features/pill_reminder/styles/atoms/SpecificReminderCardHeader';

interface ISpecificReminderCardHeaderProps {
  days: number[];
  title?: string;
}

// 특정 알약 복용 알림 카드 상단 요일 및 이름 헤더 컴포넌트
export const SpecificReminderCardHeader = memo(
  ({ days, title }: ISpecificReminderCardHeaderProps) => {
    const hasTitle = Boolean(title);

    return (
      <>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Bell size={fontPx(16)} color={COLOR.primary} />
            <BaseText size={13} weight="semiBold" style={styles.dayText}>
              {formatReminderDays(days)}
            </BaseText>
          </View>
        </View>

        {hasTitle && (
          <BaseText size={15} weight="bold" style={styles.titleText}>
            {title}
          </BaseText>
        )}
      </>
    );
  },
);

SpecificReminderCardHeader.displayName = 'SpecificReminderCardHeader';
