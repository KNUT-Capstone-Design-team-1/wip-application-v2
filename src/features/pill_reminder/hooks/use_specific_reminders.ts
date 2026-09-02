import { useState, useEffect, useCallback } from 'react';
import { IPillReminder } from '@features/pill_reminder/types/pill_reminder_type';
import { pillReminderService } from '@features/pill_reminder/services/pill_reminder_service';
import { router } from 'expo-router';

// 특정 알약에 대한 복용 알림 목록 로드 및 네비게이션 훅
export const useSpecificReminders = (
  visible: boolean,
  itemSeq: string,
  onClose: () => void,
) => {
  const [reminders, setReminders] = useState<IPillReminder[]>([]);

  // 특정 알약 알림 데이터 로드
  const loadSpecificReminders = useCallback(async () => {
    try {
      const data = await pillReminderService.getRemindersByItemSeq(itemSeq);
      setReminders(data);
    } catch {
      setReminders([]);
    }
  }, [itemSeq]);

  // 바텀시트 열릴 때 데이터 로드
  useEffect(() => {
    const shouldSkipLoading = !visible || !itemSeq;
    if (shouldSkipLoading) {
      return;
    }
    loadSpecificReminders();
  }, [visible, itemSeq, loadSpecificReminders]);

  // 알림 선택 시 수정 화면 이동
  const handleSelectReminder = (reminderId: number) => {
    onClose();
    router.push({
      pathname: '/pill-reminder-setting',
      params: { reminderId: reminderId.toString() },
    });
  };

  // 알림 추가하기 버튼 클릭
  const handleAddReminder = () => {
    onClose();
    router.push({
      pathname: '/pill-reminder-setting',
      params: { initialItemSeqs: JSON.stringify([itemSeq]) },
    });
  };

  return {
    reminders,
    handleSelectReminder,
    handleAddReminder,
  };
};
