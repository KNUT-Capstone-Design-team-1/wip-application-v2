import React, { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { FileText } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { styles } from '@features/pill_reminder/styles/atoms/ReminderCardMemo';

interface IReminderCardMemoProps {
  memo?: string;
}

// 알림 카드 하단 메모 박스 컴포넌트
export const ReminderCardMemo = memo(({ memo }: IReminderCardMemoProps) => {
  const hasNoMemo = !memo;

  if (hasNoMemo) {
    return null;
  }

  return (
    <View style={styles.memoContainer}>
      <FileText size={fontPx(13)} color={COLOR_TEXT.sub} />
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
});

ReminderCardMemo.displayName = 'ReminderCardMemo';
