import { useCallback } from 'react';
import { useModalToast } from '@features/pill_reminder/hooks/use_modal_toast';
import {
  usePillReminderModalFolderData,
  IPillSelectOption,
} from '@features/pill_reminder/hooks/use_pill_reminder_modal_folder_data';
import { usePillReminderModalSelection } from '@features/pill_reminder/hooks/use_pill_reminder_modal_selection';

export type { IPillSelectOption };

interface IUsePillReminderSelectModalProps {
  visible: boolean;
  selectedItemSeqs: string[];
  onConfirm: (
    selectedSeqs: string[],
    folderId?: number,
    folderName?: string,
  ) => void;
  onClose: () => void;
}

// 알약 선택 모달 통합 파사드 커스텀 훅 (데이터 로딩 & 선택 로직 조합)
export const usePillReminderSelectModal = ({
  visible,
  selectedItemSeqs,
  onConfirm,
  onClose,
}: IUsePillReminderSelectModalProps) => {
  const { toastMessage, isToastVisible, toastOpacity, showModalToast } =
    useModalToast();

  // 다른 폴더 선택 충돌 알림 토스트 핸들러
  const handleShowConflictToast = useCallback(() => {
    showModalToast(
      '같은 폴더의 알약만 복용 알림을 설정할 수 있어요.\n기존 선택한 알약은 선택 해제됩니다.',
    );
  }, [showModalToast]);

  // 1. 폴더 목록 및 폴더별 알약 데이터 로딩 훅
  const { folders, selectedFolderId, folderPills, handleSelectFolder } =
    usePillReminderModalFolderData({
      visible,
      selectedItemSeqs,
      onInitialFolderDetected: (detectedFolderId) => {
        setActiveSelectedFolderId(detectedFolderId);
      },
    });

  // 2. 알약 선택/해제 및 충돌 제어 훅
  const {
    activeSelectedFolderId,
    tempSelectedSeqs,
    displayedSelectedSeqs,
    isAllSelected,
    setActiveSelectedFolderId,
    toggleSelect,
    toggleSelectAll,
  } = usePillReminderModalSelection({
    visible,
    selectedItemSeqs,
    selectedFolderId,
    folderPills,
    onShowConflictToast: handleShowConflictToast,
  });

  // 선택 완료 핸들러 (사용자가 선택한 폴더 ID와 폴더명을 명확히 전달)
  const handleConfirm = () => {
    const targetFolderId = activeSelectedFolderId || selectedFolderId;
    const targetFolder = folders.find((f) => f.id === targetFolderId);

    onConfirm(
      tempSelectedSeqs,
      targetFolderId || undefined,
      targetFolder?.name,
    );
    onClose();
  };

  return {
    folders,
    selectedFolderId,
    folderPills,
    tempSelectedSeqs,
    displayedSelectedSeqs,
    isAllSelected,
    toastMessage,
    isToastVisible,
    toastOpacity,
    handleSelectFolder,
    toggleSelect,
    toggleSelectAll,
    handleConfirm,
  };
};
