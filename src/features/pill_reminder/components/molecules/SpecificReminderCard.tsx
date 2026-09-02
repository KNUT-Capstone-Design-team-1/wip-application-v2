import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { IPillReminder } from '@features/pill_reminder/types/pill_reminder_type';
import { SpecificReminderCardHeader } from '@features/pill_reminder/components/atoms/SpecificReminderCardHeader';
import { SpecificReminderCardBody } from '@features/pill_reminder/components/atoms/SpecificReminderCardBody';
import { SpecificReminderCardMemo } from '@features/pill_reminder/components/atoms/SpecificReminderCardMemo';
import { styles } from '@features/pill_reminder/styles/molecules/SpecificReminderCard';

interface ISpecificReminderCardProps {
  reminder: IPillReminder;
  itemSeq: string;
  itemName: string;
  onPress: (id: number) => void;
}

// 특정 알약 복용 알림 개별 카드 컴포넌트 (모듈화된 atom 컴포넌트 조합)
export const SpecificReminderCard = memo(
  ({ reminder, itemSeq, itemName, onPress }: ISpecificReminderCardProps) => {
    const targetItem = reminder.items.find((i) => i.item_seq === itemSeq);
    const dosage = targetItem ? `${targetItem.dosage}정` : '';
    const otherItems = reminder.items.filter((i) => i.item_seq !== itemSeq);
    const otherText =
      otherItems.length > 0 ? ` (외 ${otherItems.length}개 알약 포함)` : '';

    return (
      <TouchableOpacity
        style={styles.reminderCard}
        onPress={() => onPress(reminder.id)}
        activeOpacity={0.7}
      >
        {/* 요일 및 알림 이름 헤더 */}
        <SpecificReminderCardHeader
          days={reminder.days}
          title={reminder.title}
        />

        {/* 시간 및 복용량 본문 */}
        <SpecificReminderCardBody
          time={reminder.time}
          itemName={itemName}
          dosage={dosage}
          otherText={otherText}
        />

        {/* 메모 영역 */}
        <SpecificReminderCardMemo memo={reminder.memo} />
      </TouchableOpacity>
    );
  },
);

SpecificReminderCard.displayName = 'SpecificReminderCard';
