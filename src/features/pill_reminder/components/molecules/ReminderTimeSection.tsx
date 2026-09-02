import React, { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { TimeChip } from '@features/pill_reminder/components/atoms/TimeChip';
import { styles } from '@features/pill_reminder/styles/molecules/ReminderTimeSection';

interface IReminderTimeSectionProps {
  times: string[];
  onOpenTimePicker: () => void;
  onEditTime: (time: string) => void;
  onRemoveTime: (time: string) => void;
}

// 복용 시간 목록 설정 섹션 컴포넌트
export const ReminderTimeSection = memo(
  ({
    times,
    onOpenTimePicker,
    onEditTime,
    onRemoveTime,
  }: IReminderTimeSectionProps) => {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <BaseText size={20} weight="bold" style={styles.sectionTitle}>
            복용 시간 {times.length > 0 && `(${times.length}회)`}
          </BaseText>
        </View>

        <View style={styles.timesContainer}>
          {times.map((t) => (
            <TimeChip
              key={t}
              time={t}
              onPress={() => onEditTime(t)}
              onRemove={times.length > 1 ? () => onRemoveTime(t) : undefined}
            />
          ))}

          {/* 복용 시간 추가 + 버튼 항상 노출 */}
          <TimeChip time="" isAddButton={true} onPressAdd={onOpenTimePicker} />
        </View>
      </View>
    );
  },
);

ReminderTimeSection.displayName = 'ReminderTimeSection';
