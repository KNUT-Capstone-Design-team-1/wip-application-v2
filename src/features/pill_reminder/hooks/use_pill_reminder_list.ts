import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePillReminderStore } from '@features/pill_reminder/store/pill_reminder_store';
import { useCommonModalStore } from '@store/common_modal_store';
import { router, useFocusEffect } from 'expo-router';
import Toast from 'react-native-toast-message';

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

  // 편집 모드 및 선택된 알림 ID 목록 상태
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 화면 진입 시 알림 목록 갱신
  useFocusEffect(
    useCallback(() => {
      fetchReminders();
    }, [fetchReminders]),
  );

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  // 편집 모드 토글 핸들러
  const handleToggleEdit = useCallback(() => {
    setIsEditing((prev) => {
      const next = !prev;

      if (!next) {
        setSelectedIds([]);
      }

      return next;
    });
  }, []);

  // 개별 알림 선택/해제 토글 핸들러
  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const isAlreadySelected = prev.includes(id);

      if (isAlreadySelected) {
        return prev.filter((item) => item !== id);
      }

      return [...prev, id];
    });
  }, []);

  // 전체 선택 여부
  const allSelected = useMemo(() => {
    const hasItems = reminders.length > 0;
    return (
      hasItems &&
      selectedIds.length > 0 &&
      selectedIds.length === reminders.length
    );
  }, [reminders.length, selectedIds.length]);

  // 전체 선택 / 전체 해제 토글 핸들러
  const toggleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(reminders.map((r) => r.id));
  }, [allSelected, reminders]);

  // 선택된 복용 알림 다중 삭제 확인 모달
  const handleMultipleDelete = useCallback(() => {
    const count = selectedIds.length;
    const hasNoSelected = count === 0;

    if (hasNoSelected) {
      return;
    }

    showModal({
      title: '알림 삭제',
      message: `선택한 ${count}개의 복용 알림을\n삭제하시겠습니까?`,
      confirmText: '삭제',
      confirmStyle: 'destructive',
      cancelText: '취소',
      onConfirm: async () => {
        try {
          for (const id of selectedIds) {
            await deleteReminder(id);
          }

          setSelectedIds([]);
          setIsEditing(false);

          Toast.show({
            type: 'success',
            text1: `${count}개의 복용 알림이 삭제되었습니다.`,
          });
        } catch {
          Toast.show({
            type: 'error',
            text1: '알림 삭제 중 오류가 발생했습니다.',
          });
        }
      },
    });
  }, [selectedIds, showModal, deleteReminder]);

  // 새 알림 생성 화면 이동
  const handleCreateReminder = () => {
    router.push('/pill-reminder-setting');
  };

  // 알림 수정 화면 이동
  const handleEditReminder = (reminderId: number) => {
    if (isEditing) {
      toggleSelect(reminderId);
      return;
    }

    router.push({
      pathname: '/pill-reminder-setting',
      params: { reminderId: reminderId.toString() },
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
    isEditing,
    selectedIds,
    allSelected,
    handleToggleEdit,
    toggleSelect,
    toggleSelectAll,
    handleMultipleDelete,
    handleCreateReminder,
    handleEditReminder,
    handleToggle,
  };
};
