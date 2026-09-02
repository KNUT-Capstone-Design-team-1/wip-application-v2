import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { usePillReminderList } from '@features/pill_reminder/hooks/use_pill_reminder_list';
import { ReminderListItem } from '@features/pill_reminder/components/molecules/ReminderListItem';
import { ReminderListEmptyView } from '@features/pill_reminder/components/molecules/ReminderListEmptyView';
import { ReminderListFooter } from '@features/pill_reminder/components/molecules/ReminderListFooter';
import { COLOR } from '@constants/color';
import { styles } from '@features/pill_reminder/styles/screens/PillReminderList';

// 복용 알림 목록 화면 컴포넌트
export const PillReminderListScreen = () => {
  const {
    reminders,
    isInitialLoading,
    isListEmpty,
    handleCreateReminder,
    handleEditReminder,
    handleDeleteReminder,
    handleToggle,
  } = usePillReminderList();

  // 초기 로딩 상태 Early Return
  if (isInitialLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLOR.primary} />
        </View>
      </View>
    );
  }

  // 데이터 없음 상태 Early Return
  if (isListEmpty) {
    return <ReminderListEmptyView onCreateReminder={handleCreateReminder} />;
  }

  return (
    <View style={styles.container}>
      {/* 알림 카드 목록 스크롤 뷰 */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {reminders.map((reminder) => (
          <ReminderListItem
            key={reminder.id}
            reminder={reminder}
            onPress={() => handleEditReminder(reminder.id)}
            onToggle={(newVal) => handleToggle(reminder.id, !newVal)}
            onDelete={() =>
              handleDeleteReminder(reminder.id, reminder.time, reminder.days)
            }
          />
        ))}
      </ScrollView>

      {/* 하단 고정 추가 버튼 푸터 */}
      <ReminderListFooter onCreateReminder={handleCreateReminder} />
    </View>
  );
};
