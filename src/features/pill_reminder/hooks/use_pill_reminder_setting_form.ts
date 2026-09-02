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

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 모달 제어 상태
  const [isPillSelectModalVisible, setIsPillSelectModalVisible] =
    useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [editingTime, setEditingTime] = useState<string | null>(null);

  // 초기 폼 데이터 로드 (이름, 메모, 폴더 정보 자동 조회 포함)
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
            setTitle(reminder.title || '');
            setMemo(reminder.memo || '');
            setTimes([reminder.time]);
            setDays(reminder.days);
            setSelectedFolderId(reminder.folder_id);
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

            // 첫 번째 알약이 속한 폴더명 조회 및 세팅
            const firstSeq = reminder.items[0]?.item_seq;
            const hasFirstSeq = Boolean(firstSeq);

            if (hasFirstSeq && firstSeq) {
              const folderInfo =
                await pillReminderService.getFolderInfoByItemSeq(firstSeq);
              const hasFolderInfo = Boolean(folderInfo);

              if (hasFolderInfo && folderInfo) {
                setSelectedFolderId(folderInfo.id);
                setSelectedFolderName(folderInfo.name);
              }
            }
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

          // 초기 알약이 속한 폴더 정보 조회 및 세팅
          const firstSeq = seqs[0];
          const hasFirstSeq = Boolean(firstSeq);

          if (hasFirstSeq && firstSeq) {
            const folderInfo =
              await pillReminderService.getFolderInfoByItemSeq(firstSeq);
            const hasFolderInfo = Boolean(folderInfo);

            if (hasFolderInfo && folderInfo) {
              setSelectedFolderId(folderInfo.id);
              setSelectedFolderName(folderInfo.name);
            }
          }
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

  // 알약 선택 모달 확인 처리 (선택된 폴더명 및 folderId 함께 저장)
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

    // 첫 번째 알약 기준 folderId 갱신
    if (selectedSeqs.length > 0) {
      const firstSeq = selectedSeqs[0];
      const folderInfo =
        await pillReminderService.getFolderInfoByItemSeq(firstSeq);
      if (folderInfo) {
        setSelectedFolderId(folderInfo.id);
        setSelectedFolderName(folderInfo.name);
      }
    }

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
        setSelectedFolderId(undefined);
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
          type: 'default',
          text1: '이미 추가된 시간입니다.',
        });
        return;
      }

      // 수정: 기존 시간 교체 후 시간순 정렬
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

    // 신규 추가: 중복 체크 후 추가 및 시간순 정렬
    const isAlreadyAdded = times.includes(selectedTime);

    if (isAlreadyAdded) {
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
  const handleRemoveTime = (timeToRemove: string) => {
    const isOnlyOneTime = times.length <= 1;

    if (isOnlyOneTime) {
      Toast.show({
        type: 'default',
        text1: '복용 시간은 최소 1개 이상 등록해야 합니다.',
      });
      return;
    }

    setTimes((prev) => prev.filter((t) => t !== timeToRemove));
  };

  // 유효성 검사: 알약 1개 이상 + 시간 1개 이상 + 요일 1개 이상
  const isFormValid = useMemo(() => {
    const hasPills = selectedPills.length > 0;
    const hasTimes = times.length > 0;
    const hasDays = days.length > 0;

    return hasPills && hasTimes && hasDays;
  }, [selectedPills.length, times.length, days.length]);

  // 저장 (생성 / 수정) 핸들러
  const handleSave = async () => {
    const hasNoPills = selectedPills.length === 0;

    if (hasNoPills) {
      Toast.show({
        type: 'default',
        text1: '복용할 알약을 1개 이상 선택해주세요.',
      });
      return;
    }

    const hasNoTimes = times.length === 0;

    if (hasNoTimes) {
      Toast.show({
        type: 'default',
        text1: '복용 시간을 1개 이상 추가해주세요.',
      });
      return;
    }

    const hasNoDays = days.length === 0;

    if (hasNoDays) {
      Toast.show({
        type: 'default',
        text1: '복용 요일을 1개 이상 선택해주세요.',
      });
      return;
    }

    setSaving(true);

    try {
      if (isEditMode && reminderId) {
        // 수정 모드
        const success = await pillReminderService.updateReminder({
          id: parseInt(reminderId, 10),
          folder_id: selectedFolderId,
          title,
          memo,
          time: times[0] || '08:00',
          days,
          items: selectedPills.map((p) => ({
            item_seq: p.item_seq,
            item_name: p.item_name,
            dosage: p.dosage,
          })),
        });

        const isUpdated = Boolean(success);

        if (isUpdated) {
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
        // 생성 모드: 선택된 모든 시간에 대해 개별 알림 생성
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

        const isCreated = ids.length > 0;

        if (isCreated) {
          Toast.show({
            type: 'success',
            text1: `${ids.length}개의 복용 알림이 설정되었습니다.`,
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

  return {
    title,
    memo,
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
