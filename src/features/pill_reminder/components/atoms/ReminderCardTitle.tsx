import React, { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/pill_reminder/styles/atoms/ReminderCardTitle';

interface IReminderCardTitleProps {
  title?: string;
}

// 알림 카드 상단 이름 텍스트 컴포넌트
export const ReminderCardTitle = memo(({ title }: IReminderCardTitleProps) => {
  const hasNoTitle = !title;

  if (hasNoTitle) {
    return null;
  }

  return (
    <View style={styles.titleRow}>
      <BaseText
        size={16}
        weight="bold"
        style={styles.titleText}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </BaseText>
    </View>
  );
});

ReminderCardTitle.displayName = 'ReminderCardTitle';
