import { useState, useEffect, useMemo } from 'react';
import { IPillReminderItem } from '@features/pill_reminder/types/pill_reminder_type';
import { pillReminderService } from '@features/pill_reminder/services/pill_reminder_service';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

export interface ISelectedPillItem extends IPillReminderItem {
  folder_name?: string;
}

interface IUsePillReminderSettingFormProps {
  reminderId?: string;
  initialItemSeqs?: string;
}

// 복용 알림 생성/수정 폼의 전체 상태 및 비즈니스 로직을 관리하는 커스텀 훅
export const usePillReminderSettingForm = ({
  reminderId,
  initialItemSeqs,
}: IUsePillReminderSettingFormProps) => {
  const isEditMode = Boolean(reminderId);

  // 폼 상태 (초기 생성 시 시간 및 요일 기본값은 빈 배열)
  const [times, setTimes] = useState<string[]>([]);
  const [days, setDays] = useState<number[]>([]);
  const [selectedPills, setSelectedPills] = useState<ISelectedPillItem[]>([]);
  const [selectedFolderName, setSelectedFolderName] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 모달 제어 상태
  const [isPillSelectModalVisible, setIsPillSelectModalVisible] =
    useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [editingTime, setEditingTime] = useState<string | null>(null);

  // 초기 폼 데이터 로드
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);

      try {
        // 수정 모드일 때 기존 알림 데이터 세팅
        if (isEditMode && reminderId) {
          const reminder = await pillReminderService.getReminderById(
            parseInt(reminderId, 10),
          );

          const hasReminder = Boolean(reminder);

          if (hasReminder && reminder) {
            setTimes([reminder.time]);
            setDays(reminder.days);
            setSelectedPills(
              reminder.items.map((item) => ({
                item_seq: item.item_seq,
                item_name: item.item_name,
                dosage: item.dosage || 1,
                item_image: item.item_image,
                class_name: item.class_name,
                entp_name: item.entp_name,
              })),
            );
          }

          return;
        }

        // 생성 모드: 초기 전달된 특정 알약 시퀀스가 있는 경우 세팅
        let seqs: string[] = [];

        const hasInitialItemSeqs = Boolean(initialItemSeqs);

        if (hasInitialItemSeqs && initialItemSeqs) {
          try {
            seqs = JSON.parse(initialItemSeqs);
          } catch {
            seqs = [initialItemSeqs];
          }
        }

        const hasInitialSeqs = seqs.length > 0;

        if (hasInitialSeqs) {
          const pillsInfo = await pillReminderService.getPillsBySeqs(seqs);

          setSelectedPills(
            pillsInfo.map((p) => ({
              item_seq: p.item_seq,
              item_name: p.item_name,
              dosage: 1,
              item_image: p.item_image,
              class_name: p.class_name,
              entp_name: p.entp_name,
            })),
          );
        }
      } catch {
        Toast.show({
          type: 'error',
          text1: '알림 정보를 불러오는데 실패했습니다.',
        });
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [reminderId, initialItemSeqs, isEditMode]);

  // 알약 선택 모달 확인 처리 (선택된 폴더명 함께 저장)
  const handleConfirmPillSelection = async (
    selectedSeqs: string[],
    folderName?: string,
  ) => {
    const hasFolderName = Boolean(folderName);

    if (hasFolderName && folderName) {
      setSelectedFolderName(folderName);
    }

    const existingMap = new Map(selectedPills.map((p) => [p.item_seq, p]));
    const pillsInfo = await pillReminderService.getPillsBySeqs(selectedSeqs);

    const newSelectedPills = pillsInfo.map((p) => {
      const existing = existingMap.get(p.item_seq);

      return {
        item_seq: p.item_seq,
        item_name: p.item_name,
        dosage: existing ? existing.dosage : 1,
        item_image: p.item_image,
        class_name: p.class_name,
        entp_name: p.entp_name,
        folder_name: folderName || existing?.folder_name || selectedFolderName,
      };
    });

    setSelectedPills(newSelectedPills);
  };

  // 단일 알약 삭제 핸들러
  const handleRemovePill = (seq: string) => {
    setSelectedPills((prev) => {
      const next = prev.filter((p) => p.item_seq !== seq);

      const isEmptyPills = next.length === 0;

      if (isEmptyPills) {
        setSelectedFolderName('');
      }

      return next;
    });
  };

  // 복용량 변경 핸들러
  const handleDosageChange = (seq: string, dosage: number) => {
    setSelectedPills((prev) =>
      prev.map((p) => {
        const isTarget = p.item_seq === seq;

        if (isTarget) {
          return { ...p, dosage };
        }

        return p;
      }),
    );
  };

  // 복용 시간 추가 또는 수정 모달 열기 핸들러
  const handleOpenTimePicker = (timeToEdit?: string) => {
    const isEdit = Boolean(timeToEdit);

    if (isEdit && timeToEdit) {
      setEditingTime(timeToEdit);
    } else {
      setEditingTime(null);
    }

    setIsTimePickerVisible(true);
  };

  // 복용 시간 선택 모달 확인 핸들러 (추가 및 수정 공통)
  const handleConfirmTimePicker = (selectedTime: string) => {
    const isEditing = editingTime !== null;

    if (isEditing && editingTime) {
      const isUnchanged = selectedTime === editingTime;

      if (isUnchanged) {
        setIsTimePickerVisible(false);
        setEditingTime(null);
        return;
      }

      const isAlreadyAdded = times.includes(selectedTime);

      if (isAlreadyAdded) {
        Toast.show({
          type: 'info',
          text1: '이미 추가된 시간입니다.',
        });
        return;
      }

      setTimes((prev) =>
        prev.map((t) => (t === editingTime ? selectedTime : t)).sort(),
      );

      setIsTimePickerVisible(false);
      setEditingTime(null);
      return;
    }

    // 추가 모드
    const isAlreadyAdded = times.includes(selectedTime);

    if (isAlreadyAdded) {
      Toast.show({
        type: 'info',
        text1: '이미 추가된 시간입니다.',
      });
      return;
    }

    setTimes((prev) => [...prev, selectedTime].sort());
    setIsTimePickerVisible(false);
    setEditingTime(null);
  };

  // 복용 시간 삭제 핸들러 (0개까지 삭제 허용)
  const handleRemoveTime = (timeToRemove: string) => {
    setTimes((prev) => prev.filter((t) => t !== timeToRemove));
  };

  // 저장 처리 및 유효성 검사
  const handleSave = async () => {
    const isNoPillsSelected = selectedPills.length === 0;

    if (isNoPillsSelected) {
      Toast.show({
        type: 'error',
        text1: '복용할 알약을 선택해 주세요.',
      });
      return;
    }

    const isNoTimesConfigured = times.length === 0;

    if (isNoTimesConfigured) {
      Toast.show({
        type: 'error',
        text1: '복용 시간을 1개 이상 설정해 주세요.',
      });
      return;
    }

    const isNoDaysSelected = days.length === 0;

    if (isNoDaysSelected) {
      Toast.show({
        type: 'error',
        text1: '복용 요일을 1개 이상 선택해 주세요.',
      });
      return;
    }

    setSaving(true);

    try {
      if (isEditMode && reminderId) {
        await pillReminderService.updateReminder({
          id: parseInt(reminderId, 10),
          time: times[0],
          days,
          items: selectedPills.map((p) => ({
            item_seq: p.item_seq,
            item_name: p.item_name,
            dosage: p.dosage || 1,
            item_image: p.item_image,
            class_name: p.class_name,
            entp_name: p.entp_name,
          })),
        });

        Toast.show({
          type: 'success',
          text1: '복용 알림이 수정되었습니다.',
        });
      } else {
        await pillReminderService.createReminders({
          times,
          days,
          items: selectedPills.map((p) => ({
            item_seq: p.item_seq,
            item_name: p.item_name,
            dosage: p.dosage || 1,
            item_image: p.item_image,
            class_name: p.class_name,
            entp_name: p.entp_name,
          })),
        });

        Toast.show({
          type: 'success',
          text1: '복용 알림이 설정되었습니다.',
        });
      }

      router.back();
    } catch {
      Toast.show({
        type: 'error',
        text1: isEditMode
          ? '알림 수정에 실패했습니다.'
          : '알림 설정에 실패했습니다.',
      });
    } finally {
      setSaving(false);
    }
  };

  // 폼 저장 가능 여부
  const isFormValid = useMemo(() => {
    const hasPills = selectedPills.length > 0;
    const hasTimes = times.length > 0;
    const hasDays = days.length > 0;

    return hasPills && hasTimes && hasDays;
  }, [selectedPills, times, days]);

  return {
    times,
    days,
    selectedPills,
    selectedFolderName,
    loading,
    saving,
    isEditMode,
    isFormValid,
    isPillSelectModalVisible,
    isTimePickerVisible,
    editingTime,
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
