import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { IPillReminder } from '@features/pill_reminder/types/pill_reminder_type';
import { formatReminderDays } from '@features/pill_reminder/utils/reminder_format';
import { ReminderCardTitle } from '@features/pill_reminder/components/atoms/ReminderCardTitle';
import { ReminderTimeHeader } from '@features/pill_reminder/components/atoms/ReminderTimeHeader';
import { ReminderActionButtons } from '@features/pill_reminder/components/atoms/ReminderActionButtons';
import { ReminderPillSummary } from '@features/pill_reminder/components/atoms/ReminderPillSummary';
import { ReminderCardMemo } from '@features/pill_reminder/components/atoms/ReminderCardMemo';
import { styles } from '@features/pill_reminder/styles/molecules/ReminderListItem';

export { formatReminderDays };

interface IReminderListItemProps {
  reminder: IPillReminder;
  onPress: () => void;
  onToggle: (isEnabled: boolean) => void;
  onDelete: () => void;
}

// 복용 알림 목록의 개별 알림 카드 컴포넌트 (모듈화된 atom 컴포넌트 조합)
export const ReminderListItem = memo(
  ({ reminder, onPress, onToggle, onDelete }: IReminderListItemProps) => {
    const daysText = formatReminderDays(reminder.days);

    // 알약 요약 문구 생성 (2개 이상 시 'xx 외 n개')
    const itemCount = reminder.items.length;
    let pillsText = '등록된 알약 없음';

    if (itemCount === 1) {
      const firstItem = reminder.items[0];
      pillsText = `${firstItem.item_name} ${firstItem.dosage}정`;
    } else if (itemCount > 1) {
      const firstItem = reminder.items[0];
      pillsText = `${firstItem.item_name} 외 ${itemCount - 1}개`;
    }

    return (
      <TouchableOpacity
        style={[
          styles.container,
          !reminder.is_enabled && styles.disabledContainer,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* 알림 이름 표시 */}
        <ReminderCardTitle title={reminder.title} />

        {/* 시간, 요일 및 조작 버튼 */}
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

        {/* 알약 목록 요약 */}
        <ReminderPillSummary
          pillsText={pillsText}
          isEnabled={reminder.is_enabled}
        />

        {/* 메모 영역 */}
        <ReminderCardMemo memo={reminder.memo} />
      </TouchableOpacity>
    );
  },
);

ReminderListItem.displayName = 'ReminderListItem';
