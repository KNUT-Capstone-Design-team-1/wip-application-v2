import React, { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { Bell } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { styles } from '@features/pill_reminder/styles/molecules/SpecificReminderEmptyView';

// 특정 알약 복용 알림 없음 컴포넌트
export const SpecificReminderEmptyView = memo(() => {
  return (
    <View style={styles.emptyContainer}>
      <Bell size={fontPx(32)} color={COLOR_TEXT.disabled} />
      <BaseText size={15} style={styles.emptyText}>
        설정된 복용 알림이 없습니다.
      </BaseText>
    </View>
  );
});

SpecificReminderEmptyView.displayName = 'SpecificReminderEmptyView';
