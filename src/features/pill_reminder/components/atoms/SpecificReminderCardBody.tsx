import React, { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { ChevronRight } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { formatReminderTime } from '@features/pill_reminder/utils/reminder_format';
import { styles } from '@features/pill_reminder/styles/atoms/SpecificReminderCardBody';

interface ISpecificReminderCardBodyProps {
  time: string;
  itemName: string;
  dosage: string;
  otherText: string;
}

// 특정 알약 복용 알림 카드 중간 시간 및 복용량 표시 컴포넌트
export const SpecificReminderCardBody = memo(
  ({ time, itemName, dosage, otherText }: ISpecificReminderCardBodyProps) => {
    const formattedTime = formatReminderTime(time);

    return (
      <View style={styles.cardBody}>
        <View style={styles.cardBodyLeft}>
          <BaseText size={20} weight="bold" style={styles.timeText}>
            {formattedTime}
          </BaseText>
          <BaseText size={14} weight="medium" style={styles.dosageText}>
            {itemName} {dosage}
            {otherText}
          </BaseText>
        </View>
        <ChevronRight size={fontPx(20)} color={COLOR_TEXT.sub} />
      </View>
    );
  },
);

SpecificReminderCardBody.displayName = 'SpecificReminderCardBody';
