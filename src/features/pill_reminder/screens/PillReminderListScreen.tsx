import React from 'react';
import { View, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { usePillReminderList } from '@features/pill_reminder/hooks/use_pill_reminder_list';
import { ReminderListHeader } from '@features/pill_reminder/components/molecules/ReminderListHeader';
import { ReminderListItem } from '@features/pill_reminder/components/molecules/ReminderListItem';
import { ReminderListEmptyView } from '@features/pill_reminder/components/molecules/ReminderListEmptyView';
import { ReminderListFooter } from '@features/pill_reminder/components/molecules/ReminderListFooter';
import { ReminderEditBottomBar } from '@features/pill_reminder/components/molecules/ReminderEditBottomBar';
import { COLOR } from '@constants/color';
import { styles } from '@features/pill_reminder/styles/screens/PillReminderList';

// 복용 알림 목록 화면 컴포넌트
export const PillReminderListScreen = () => {
  const {
    reminders,
    isInitialLoading,
    isListEmpty,
    isEditing,
    selectedIds,
    allSelected,
    handleToggleEdit,
    toggleSelect,
    toggleSelectAll,
    handleBackgroundPress,
    handleMultipleDelete,
    handleCreateReminder,
    handleEditReminder,
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
    <Pressable style={styles.container} onPress={handleBackgroundPress}>
      {/* 상단 카운트 및 편집/전체선택 헤더 */}
      <ReminderListHeader
        count={reminders.length}
        isEditing={isEditing}
        allSelected={allSelected}
        onToggleEdit={handleToggleEdit}
        onSelectAll={toggleSelectAll}
      />

      {/* 알림 카드 목록 스크롤 뷰 */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={handleBackgroundPress}>
          {reminders.map((reminder) => {
            const isSelected = selectedIds.includes(reminder.id);

            return (
              <ReminderListItem
                key={reminder.id}
                reminder={reminder}
                isEditing={isEditing}
                isSelected={isSelected}
                onPress={() => {
                  if (isEditing) {
                    toggleSelect(reminder.id);
                  } else {
                    handleEditReminder(reminder.id);
                  }
                }}
                onToggle={(newVal) => handleToggle(reminder.id, !newVal)}
              />
            );
          })}
        </Pressable>
      </ScrollView>

      {/* 하단 고정 바 (편집 모드: 큰 삭제 버튼 바 / 일반 모드: 추가 버튼 푸터) */}
      {isEditing ? (
        <ReminderEditBottomBar
          selectedCount={selectedIds.length}
          onDelete={handleMultipleDelete}
        />
      ) : (
        <ReminderListFooter onCreateReminder={handleCreateReminder} />
      )}
    </Pressable>
  );
};
