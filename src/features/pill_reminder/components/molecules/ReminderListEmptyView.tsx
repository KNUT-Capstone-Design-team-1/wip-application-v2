import React, { memo } from 'react';
import { View } from 'react-native';
import NotItem from '@components/common/NotItem';
import { styles } from '@features/pill_reminder/styles/molecules/ReminderListEmptyView';

// 복용 알림 목록 빈 화면 컴포넌트
export const ReminderListEmptyView = memo(() => {
  return (
    <View style={styles.emptyContainer}>
      <NotItem
        mainText="등록된 복용 알림이 없습니다."
        subText="복용 알림을 추가하여 제때 약을 챙겨드세요!"
      />
    </View>
  );
});

ReminderListEmptyView.displayName = 'ReminderListEmptyView';
