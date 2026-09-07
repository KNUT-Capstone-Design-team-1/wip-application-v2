import { useState, useMemo } from 'react';
import {
  ISelectedPillItem,
  IUsePillReminderSettingFormProps,
  IUsePillReminderSettingFormReturn,
} from '@features/pill_reminder/types';
import { pillReminderService } from '@features/pill_reminder/services/pill_reminder_service';
import { validateReminderTimesLimit } from '@features/pill_reminder/utils/reminder_validation';
import { usePillReminderFormInit } from '@features/pill_reminder/hooks/use_pill_reminder_form_init';
import { usePillReminderFormSave } from '@features/pill_reminder/hooks/use_pill_reminder_form_save';
import Toast from 'react-native-toast-message';

export type { ISelectedPillItem };

// 복용 알림 생성/수정 폼의 전체 상태 및 비즈니스 로직을 조합하는 커스텀 훅
export const usePillReminderSettingForm = ({
  reminderId,
  initialItemSeqs,
}: IUsePillReminderSettingFormProps): IUsePillReminderSettingFormReturn => {
  // 폼 상태
  const [title, setTitle] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [times, setTimes] = useState<string[]>([]);
  const [days, setDays] = useState<number[]>([]);
  const [selectedPills, setSelectedPills] = useState<ISelectedPillItem[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | undefined>(
    undefined,
  );
  const [selectedFolderName, setSelectedFolderName] = useState<string>('');

  // 모달 제어 상태
  const [isPillSelectModalVisible, setIsPillSelectModalVisible] =
    useState<boolean>(false);
  const [isTimePickerVisible, setIsTimePickerVisible] =
    useState<boolean>(false);
  const [editingTime, setEditingTime] = useState<string | null>(null);

  // 초기화 훅
  const {
    loading,
    hasPermission: initialHasPermission,
    isEditMode,
  } = usePillReminderFormInit({
    reminderId,
    initialItemSeqs,
    setTitle,
    setMemo,
    setTimes,
    setDays,
    setSelectedPills,
    setSelectedFolderId,
    setSelectedFolderName,
  });

  const [hasPermission, setHasPermission] =
    useState<boolean>(initialHasPermission);

  // 저장 훅
  const { saving, handleSave } = usePillReminderFormSave({
    reminderId,
    isEditMode,
    title,
    memo,
    times,
    days,
    selectedPills,
    selectedFolderId,
    setHasPermission,
  });

  // 알약 선택 모달 확인 처리
  const handleConfirmPillSelection = async (
    selectedSeqs: string[],
    folderId?: number,
    folderName?: string,
  ): Promise<void> => {
    if (folderId) {
      setSelectedFolderId(folderId);
    }

    if (folderName) {
      setSelectedFolderName(folderName);
    }

    const existingMap = new Map(selectedPills.map((p) => [p.item_seq, p]));
    const pillsInfo = await pillReminderService.getPillsBySeqs(selectedSeqs);

    const targetFolderName =
      folderName || selectedFolderName || '알 수 없는 폴더';

    const newSelectedPills = pillsInfo.map((p) => {
      const existing = existingMap.get(p.item_seq);

      return {
        item_seq: p.item_seq,
        item_name: p.item_name,
        dosage: existing ? existing.dosage : 1,
        item_image: p.item_image,
        class_name: p.class_name,
        entp_name: p.entp_name,
        folder_name: targetFolderName,
      };
    });

    setSelectedPills(newSelectedPills);
  };

  // 단일 알약 삭제 핸들러
  const handleRemovePill = (seq: string): void => {
    setSelectedPills((prev) => {
      const next = prev.filter((p) => p.item_seq !== seq);
      if (next.length === 0) {
        setSelectedFolderName('');
        setSelectedFolderId(undefined);
      }
      return next;
    });
  };

  // 복용량 변경 핸들러
  const handleDosageChange = (seq: string, dosage: number): void => {
    setSelectedPills((prev) =>
      prev.map((p) => (p.item_seq === seq ? { ...p, dosage } : p)),
    );
  };

  // 복용 시간 추가 또는 수정 모달 열기 핸들러
  const handleOpenTimePicker = (timeToEdit?: string): void => {
    if (timeToEdit) {
      setEditingTime(timeToEdit);
    } else {
      const validation = validateReminderTimesLimit(times.length);
      if (!validation.isValid) {
        Toast.show({
          type: 'default',
          text1: validation.errorMessage,
        });
        return;
      }
      setEditingTime(null);
    }

    setIsTimePickerVisible(true);
  };

  // 복용 시간 선택 모달 확인 핸들러
  const handleConfirmTimePicker = (selectedTime: string): void => {
    const isEditing = editingTime !== null;

    if (isEditing && editingTime) {
      if (selectedTime === editingTime) {
        setIsTimePickerVisible(false);
        setEditingTime(null);
        return;
      }

      if (times.includes(selectedTime)) {
        Toast.show({
          type: 'default',
          text1: '이미 추가된 시간입니다.',
        });
        return;
      }

      setTimes((prev) => {
        const replaced = prev.map((t) =>
          t === editingTime ? selectedTime : t,
        );
        return [...replaced].sort();
      });

      setIsTimePickerVisible(false);
      setEditingTime(null);
      return;
    }

    const validation = validateReminderTimesLimit(times.length);
    if (!validation.isValid) {
      Toast.show({
        type: 'default',
        text1: validation.errorMessage,
      });
      setIsTimePickerVisible(false);
      return;
    }

    if (times.includes(selectedTime)) {
      Toast.show({
        type: 'default',
        text1: '이미 추가된 시간입니다.',
      });
      return;
    }

    setTimes((prev) => [...prev, selectedTime].sort());
    setIsTimePickerVisible(false);
  };

  // 복용 시간 삭제 핸들러
  const handleRemoveTime = (timeToRemove: string): void => {
    if (times.length <= 1) {
      Toast.show({
        type: 'default',
        text1: '복용 시간은 최소 1개 이상 등록해야 합니다.',
      });
      return;
    }

    setTimes((prev) => prev.filter((t) => t !== timeToRemove));
  };

  // 유효성 검사
  const isFormValid = useMemo(() => {
    return selectedPills.length > 0 && times.length > 0 && days.length > 0;
  }, [selectedPills.length, times.length, days.length]);

  return {
    title,
    memo,
    times,
    days,
    selectedPills,
    selectedFolderName,
    loading,
    saving,
    hasPermission,
    isEditMode,
    isFormValid,
    isPillSelectModalVisible,
    isTimePickerVisible,
    editingTime,
    setTitle,
    setMemo,
    setIsPillSelectModalVisible,
    setIsTimePickerVisible,
    setDays,
    handleConfirmPillSelection,
    handleRemovePill,
    handleDosageChange,
    handleOpenTimePicker,
    handleConfirmTimePicker,
    handleRemoveTime,
    handleSave,
  };
};
