import React, { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { ChevronRight } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { styles } from '@features/pill_reminder/styles/atoms/ReminderPillSummary';

interface IReminderPillSummaryProps {
  pillsText: string;
  isEnabled: boolean;
}

// 알림 카드 하단 알약 요약 텍스트 및 화살표 컴포넌트 (1줄 말줄임 처리)
export const ReminderPillSummary = memo(
  ({ pillsText, isEnabled }: IReminderPillSummaryProps) => {
    return (
      <View style={styles.container}>
        <BaseText
          size={14}
          weight="medium"
          style={isEnabled ? styles.pillsText : styles.disabledText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {pillsText || '등록된 알약 없음'}
        </BaseText>
        <ChevronRight size={fontPx(18)} color={COLOR_TEXT.sub} />
      </View>
    );
  },
);

ReminderPillSummary.displayName = 'ReminderPillSummary';
