import { useState, useEffect, useMemo, useCallback } from 'react';
import { IFolderTabOption } from '@features/pill_reminder/components/atoms/FolderSelectTabs';
import { useModalToast } from '@features/pill_reminder/hooks/use_modal_toast';
import { pillReminderService } from '@features/pill_reminder/services/pill_reminder_service';

export interface IPillSelectOption {
  item_seq: string;
  item_name: string;
  item_image?: string;
  class_name?: string;
  entp_name?: string;
}

interface IUsePillReminderSelectModalProps {
  visible: boolean;
  selectedItemSeqs: string[];
  onConfirm: (selectedSeqs: string[], folderName?: string) => void;
  onClose: () => void;
}

// 알약 선택 모달의 상태 관리 및 데이터 로드 커스텀 훅
export const usePillReminderSelectModal = ({
  visible,
  selectedItemSeqs,
  onConfirm,
  onClose,
}: IUsePillReminderSelectModalProps) => {
  const { toastMessage, isToastVisible, toastOpacity, showModalToast } =
    useModalToast();

  const [folders, setFolders] = useState<IFolderTabOption[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [folderPills, setFolderPills] = useState<IPillSelectOption[]>([]);
  const [tempSelectedSeqs, setTempSelectedSeqs] = useState<string[]>([]);

  // 모달 열릴 때 폴더 목록 로드 및 초기화
  useEffect(() => {
    const isModalClosed = !visible;

    if (isModalClosed) {
      return;
    }

    setTempSelectedSeqs([...selectedItemSeqs]);

    const loadFolders = async () => {
      try {
        const folderList = await pillReminderService.getFolders();
        setFolders(folderList);

        const hasFolders = folderList.length > 0;

        if (hasFolders) {
          const defaultFolder =
            folderList.find((f) => f.is_default === 1) || folderList[0];
          setSelectedFolderId(defaultFolder.id);
        }
      } catch {
        // ignore
      }
    };

    loadFolders();
  }, [visible, selectedItemSeqs]);

  // 선택된 폴더 변경 시 해당 폴더의 알약 목록 로드
  const loadPillsForFolder = useCallback(async (folderId: number) => {
    try {
      const pills = await pillReminderService.getPillsByFolder(folderId);
      setFolderPills(pills);
    } catch {
      setFolderPills([]);
    }
  }, []);

  useEffect(() => {
    const shouldSkipPillsLoad = !visible || selectedFolderId === null;

    if (shouldSkipPillsLoad) {
      return;
    }

    loadPillsForFolder(selectedFolderId);
  }, [visible, selectedFolderId, loadPillsForFolder]);

  // 폴더 탭 클릭 핸들러 (다른 폴더 선택 시 기존 선택 알약 해제 & 안내 토스트 표시 후 폴더 전환)
  const handleSelectFolder = (newFolderId: number) => {
    const isSameFolder = newFolderId === selectedFolderId;

    if (isSameFolder) {
      return;
    }

    const hasSelectedPills = tempSelectedSeqs.length > 0;

    if (hasSelectedPills) {
      setTempSelectedSeqs([]);
      showModalToast(
        '같은 폴더의 알약만 복용 알림을 설정할 수 있어요.\n선택한 알약은 선택 해제됩니다.',
      );
    }

    setSelectedFolderId(newFolderId);
  };

  // 알약 선택/해제 토글 핸들러
  const toggleSelect = (seq: string) => {
    setTempSelectedSeqs((prev) => {
      const isAlreadySelected = prev.includes(seq);

      if (isAlreadySelected) {
        return prev.filter((s) => s !== seq);
      }

      return [...prev, seq];
    });
  };

  // 현재 폴더 알약 전체선택 / 전체해제
  const allFolderSeqs = useMemo(
    () => folderPills.map((p) => p.item_seq),
    [folderPills],
  );

  const isAllSelected =
    allFolderSeqs.length > 0 &&
    allFolderSeqs.every((seq) => tempSelectedSeqs.includes(seq));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setTempSelectedSeqs([]);
      return;
    }

    setTempSelectedSeqs(allFolderSeqs);
  };

  // 선택 완료 핸들러
  const handleConfirm = () => {
    const currentFolder = folders.find((f) => f.id === selectedFolderId);
    onConfirm(tempSelectedSeqs, currentFolder?.name);
    onClose();
  };

  return {
    folders,
    selectedFolderId,
    folderPills,
    tempSelectedSeqs,
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
