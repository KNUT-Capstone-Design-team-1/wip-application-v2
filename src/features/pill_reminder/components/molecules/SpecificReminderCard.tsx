import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { Bell, ChevronRight } from 'lucide-react-native';
import { COLOR, COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { IPillReminder } from '@features/pill_reminder/types/pill_reminder_type';
import { formatReminderDays } from '@features/pill_reminder/utils/reminder_format';
import { styles } from '@features/pill_reminder/styles/molecules/SpecificReminderCard';

interface ISpecificReminderCardProps {
  reminder: IPillReminder;
  itemSeq: string;
  itemName: string;
  onPress: (id: number) => void;
}

// 특정 알약 복용 알림 개별 카드 컴포넌트
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
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Bell size={fontPx(16)} color={COLOR.primary} />
            <BaseText size={13} weight="semiBold" style={styles.dayText}>
              {formatReminderDays(reminder.days)}
            </BaseText>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardBodyLeft}>
            <BaseText size={20} weight="bold" style={styles.timeText}>
              {reminder.time}
            </BaseText>
            <BaseText size={14} weight="medium" style={styles.dosageText}>
              {itemName} {dosage}
              {otherText}
            </BaseText>
          </View>
          <ChevronRight size={fontPx(20)} color={COLOR_TEXT.sub} />
        </View>
      </TouchableOpacity>
    );
  },
);

SpecificReminderCard.displayName = 'SpecificReminderCard';
