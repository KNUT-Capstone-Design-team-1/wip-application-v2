import React, { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { FileText } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { styles } from '@features/pill_reminder/styles/atoms/SpecificReminderCardMemo';

interface ISpecificReminderCardMemoProps {
  memo?: string;
}

// 특정 알약 복용 알림 카드 하단 메모 박스 컴포넌트
export const SpecificReminderCardMemo = memo(
  ({ memo }: ISpecificReminderCardMemoProps) => {
    const hasNoMemo = !memo;

    if (hasNoMemo) {
      return null;
    }

    return (
      <View style={styles.memoContainer}>
        <FileText size={fontPx(12)} color={COLOR_TEXT.sub} />
        <BaseText
          size={12}
          weight="medium"
          style={styles.memoText}
          numberOfLines={2}
        >
          {memo}
        </BaseText>
      </View>
    );
  },
);

SpecificReminderCardMemo.displayName = 'SpecificReminderCardMemo';
