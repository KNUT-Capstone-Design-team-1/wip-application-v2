import { useState } from 'react';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  IUsePillReminderFormSaveParams,
  IUsePillReminderFormSaveReturn,
} from '@features/pill_reminder/types';
import { pillReminderService } from '@features/pill_reminder/services/pill_reminder_service';
import { pillReminderNotificationService } from '@features/pill_reminder/services/pill_reminder_notification_service';
import { validateNoDuplicateTimes } from '@features/pill_reminder/utils/reminder_validation';
import { MAX_REMINDER_TIMES_COUNT } from '@features/pill_reminder/constants/reminder_validation_constant';

// 복용 알림 저장 (생성/수정) 로직 훅
export const usePillReminderFormSave = ({
  reminderId,
  isEditMode,
  title,
  memo,
  times,
  days,
  selectedPills,
  selectedFolderId,
  setHasPermission,
}: IUsePillReminderFormSaveParams): IUsePillReminderFormSaveReturn => {
  const [saving, setSaving] = useState<boolean>(false);

  const handleSave = async (): Promise<void> => {
    // 알림 권한 체크
    const isGranted =
      await pillReminderNotificationService.initPermissions(true);
    setHasPermission(isGranted);

    if (!isGranted) {
      return;
    }

    if (selectedPills.length === 0) {
      Toast.show({
        type: 'default',
        text1: '복용할 알약을 1개 이상 선택해주세요.',
      });
      return;
    }

    if (times.length === 0) {
      Toast.show({
        type: 'default',
        text1: '복용 시간을 1개 이상 추가해주세요.',
      });
      return;
    }

    if (times.length > MAX_REMINDER_TIMES_COUNT) {
      Toast.show({
        type: 'default',
        text1: `복용 시간은 최대 ${MAX_REMINDER_TIMES_COUNT}개까지 등록할 수 있습니다.`,
      });
      return;
    }

    const duplicateTimeValidation = validateNoDuplicateTimes(times);
    if (!duplicateTimeValidation.isValid) {
      Toast.show({
        type: 'default',
        text1: `${duplicateTimeValidation.duplicateTime} 시간이 중복으로 입력되었습니다.`,
      });
      return;
    }

    if (days.length === 0) {
      Toast.show({
        type: 'default',
        text1: '복용 요일을 1개 이상 선택해주세요.',
      });
      return;
    }

    // 기존 알림 시간과 중복 검사
    const itemSeqs = selectedPills.map((p) => p.item_seq);
    const excludeId = reminderId ? parseInt(reminderId, 10) : undefined;
    const existingDuplicates =
      await pillReminderService.findDuplicateReminderTimes(
        itemSeqs,
        times,
        excludeId,
      );

    if (existingDuplicates.length > 0) {
      const firstDup = existingDuplicates[0];
      Toast.show({
        type: 'default',
        text1: `'${firstDup.pillName}'의 [${firstDup.time}] 복용 알림이 이미 등록되어 있습니다.`,
      });
      return;
    }

    setSaving(true);

    try {
      if (isEditMode && reminderId) {
        const success = await pillReminderService.updateReminder({
          id: parseInt(reminderId, 10),
          folder_id: selectedFolderId,
          title,
          memo,
          times,
          time: times[0] || '08:00',
          days,
          items: selectedPills.map((p) => ({
            item_seq: p.item_seq,
            item_name: p.item_name,
            dosage: p.dosage,
          })),
        });

        if (success) {
          Toast.show({
            type: 'success',
            text1: '복용 알림이 수정되었습니다.',
          });
          router.back();
        } else {
          Toast.show({
            type: 'error',
            text1: '복용 알림 수정에 실패했습니다.',
          });
        }
      } else {
        const ids = await pillReminderService.createReminders({
          folder_id: selectedFolderId,
          title,
          memo,
          times,
          days,
          items: selectedPills.map((p) => ({
            item_seq: p.item_seq,
            item_name: p.item_name,
            dosage: p.dosage,
          })),
        });

        if (ids.length > 0) {
          Toast.show({
            type: 'success',
            text1: '복용 알림이 설정되었습니다.',
          });
          router.back();
        } else {
          Toast.show({
            type: 'error',
            text1: '복용 알림 등록에 실패했습니다.',
          });
        }
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: '복용 알림 저장 중 오류가 발생했습니다.',
      });
    } finally {
      setSaving(false);
    }
  };

  return { saving, handleSave };
};
