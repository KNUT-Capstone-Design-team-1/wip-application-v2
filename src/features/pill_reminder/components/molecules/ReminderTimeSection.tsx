import React, { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { TimeChip } from '@features/pill_reminder/components/atoms/TimeChip';
import { styles } from '@features/pill_reminder/styles/molecules/ReminderTimeSection';

interface IReminderTimeSectionProps {
  times: string[];
  isEditMode: boolean;
  onOpenTimePicker: () => void;
  onEditTime: (time: string) => void;
  onRemoveTime: (time: string) => void;
}

// 복용 시간 설정 섹션 컴포넌트
export const ReminderTimeSection = memo(
  ({
    times,
    onOpenTimePicker,
    onEditTime,
    onRemoveTime,
  }: IReminderTimeSectionProps) => {
    return (
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <BaseText size={16} weight="bold" style={styles.sectionTitle}>
            복용 시간
          </BaseText>
        </View>

        <View style={styles.timesContainer}>
          {times.map((time) => (
            <TimeChip
              key={time}
              time={time}
              onPress={() => onEditTime(time)}
              onRemove={() => onRemoveTime(time)}
            />
          ))}

          <TimeChip time="" isAddButton onPressAdd={onOpenTimePicker} />
        </View>
      </View>
    );
  },
);

ReminderTimeSection.displayName = 'ReminderTimeSection';
