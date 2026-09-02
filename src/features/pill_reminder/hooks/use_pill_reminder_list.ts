import { useEffect, useCallback } from 'react';
import { usePillReminderStore } from '@features/pill_reminder/store/pill_reminder_store';
import { useCommonModalStore } from '@store/common_modal_store';
import { router, useFocusEffect } from 'expo-router';
import Toast from 'react-native-toast-message';
import { formatReminderDays } from '@features/pill_reminder/utils/reminder_format';

// 복용 알림 목록 화면의 상태 및 액션을 관리하는 커스텀 훅
export const usePillReminderList = () => {
  const { showModal } = useCommonModalStore();

  const {
    reminders,
    isLoading,
    fetchReminders,
    toggleReminder,
    deleteReminder,
  } = usePillReminderStore();

  // 화면 진입 시 알림 목록 갱신
  useFocusEffect(
    useCallback(() => {
      fetchReminders();
    }, [fetchReminders]),
  );

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  // 새 알림 생성 화면 이동
  const handleCreateReminder = () => {
    router.push('/pill-reminder-setting');
  };

  // 알림 수정 화면 이동
  const handleEditReminder = (reminderId: number) => {
    router.push({
      pathname: '/pill-reminder-setting',
      params: { reminderId: reminderId.toString() },
    });
  };

  // 알림 삭제 확인 모달
  const handleDeleteReminder = (id: number, time: string, days: number[]) => {
    const daysStr = formatReminderDays(days);

    showModal({
      title: '알림 삭제',
      message: `${daysStr} ${time} 복용 알림을\n삭제하시겠습니까?`,
      confirmText: '삭제',
      confirmStyle: 'destructive',
      cancelText: '취소',
      onConfirm: async () => {
        const success = await deleteReminder(id);
        const isDeleted = Boolean(success);

        if (isDeleted) {
          Toast.show({
            type: 'success',
            text1: '복용 알림이 삭제되었습니다.',
          });
        }
      },
    });
  };

  // 알림 활성/비활성 토글 핸들러
  const handleToggle = async (id: number, currentEnabled: boolean) => {
    await toggleReminder(id, !currentEnabled);
  };

  const isInitialLoading = isLoading && reminders.length === 0;
  const isListEmpty = reminders.length === 0;

  return {
    reminders,
    isInitialLoading,
    isListEmpty,
    handleCreateReminder,
    handleEditReminder,
    handleDeleteReminder,
    handleToggle,
  };
};
