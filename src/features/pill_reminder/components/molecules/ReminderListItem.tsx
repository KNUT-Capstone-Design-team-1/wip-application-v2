import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { IPillReminder } from '@features/pill_reminder/types/pill_reminder_type';
import { styles } from '@features/pill_reminder/styles/molecules/ReminderListItem';
import { formatReminderDays } from '@features/pill_reminder/utils/reminder_format';
import { ReminderTimeHeader } from '@features/pill_reminder/components/atoms/ReminderTimeHeader';
import { ReminderActionButtons } from '@features/pill_reminder/components/atoms/ReminderActionButtons';
import { ReminderPillSummary } from '@features/pill_reminder/components/atoms/ReminderPillSummary';

export { formatReminderDays };

interface IReminderListItemProps {
  reminder: IPillReminder;
  onPress: () => void;
  onToggle: (isEnabled: boolean) => void;
  onDelete: () => void;
}

// 복용 알림 목록의 개별 알림 카드 컴포넌트
export const ReminderListItem = memo(
  ({ reminder, onPress, onToggle, onDelete }: IReminderListItemProps) => {
    const daysText = formatReminderDays(reminder.days);
    const pillsText = reminder.items
      .map((item) => `${item.item_name} ${item.dosage}정`)
      .join(' · ');

    return (
      <TouchableOpacity
        style={[
          styles.container,
          !reminder.is_enabled && styles.disabledContainer,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.topRow}>
          <ReminderTimeHeader
            time={reminder.time}
            daysText={daysText}
            isEnabled={reminder.is_enabled}
          />
          <ReminderActionButtons
            isEnabled={reminder.is_enabled}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        </View>

        <ReminderPillSummary
          pillsText={pillsText}
          isEnabled={reminder.is_enabled}
        />
      </TouchableOpacity>
    );
  },
);

ReminderListItem.displayName = 'ReminderListItem';
