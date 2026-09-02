import React, { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { DaySelector } from '@features/pill_reminder/components/atoms/DaySelector';
import { styles } from '@features/pill_reminder/styles/molecules/ReminderDaySection';

interface IReminderDaySectionProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
}

// 복용 알림 요일 선택 섹션 컴포넌트
export const ReminderDaySection = memo(
  ({ selectedDays, onChange }: IReminderDaySectionProps) => {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <BaseText size={20} weight="bold" style={styles.sectionTitle}>
            복용 요일 선택
          </BaseText>
        </View>
        <DaySelector selectedDays={selectedDays} onChange={onChange} />
      </View>
    );
  },
);

ReminderDaySection.displayName = 'ReminderDaySection';
