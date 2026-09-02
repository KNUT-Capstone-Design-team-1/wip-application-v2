import { useState, useEffect, useMemo } from 'react';
import { IPillSelectOption } from '@features/pill_reminder/hooks/use_pill_reminder_modal_folder_data';

interface IUsePillReminderModalSelectionProps {
  visible: boolean;
  selectedItemSeqs: string[];
  selectedFolderId: number | null;
  folderPills: IPillSelectOption[];
  onShowConflictToast: () => void;
}

// 알약 선택 모달의 체크/해제 및 다중 폴더 선택 충돌 방지 로직 커스텀 훅
export const usePillReminderModalSelection = ({
  visible,
  selectedItemSeqs,
  selectedFolderId,
  folderPills,
  onShowConflictToast,
}: IUsePillReminderModalSelectionProps) => {
  const [activeSelectedFolderId, setActiveSelectedFolderId] = useState<
    number | null
  >(null);
  const [tempSelectedSeqs, setTempSelectedSeqs] = useState<string[]>([]);

  // 모달 열릴 때 초기 선택 알약 목록 동기화
  useEffect(() => {
    const isModalClosed = !visible;

    if (isModalClosed) {
      return;
    }

    setTempSelectedSeqs([...selectedItemSeqs]);
  }, [visible, selectedItemSeqs]);

  // 개별 알약 체크 토글 핸들러
  const toggleSelect = (seq: string) => {
    const isCurrentFolderActive = activeSelectedFolderId === selectedFolderId;
    const isAlreadySelected =
      isCurrentFolderActive && tempSelectedSeqs.includes(seq);

    // 체크 해제
    if (isAlreadySelected) {
      const nextSeqs = tempSelectedSeqs.filter((s) => s !== seq);
      setTempSelectedSeqs(nextSeqs);

      const isNowEmpty = nextSeqs.length === 0;

      if (isNowEmpty) {
        setActiveSelectedFolderId(null);
      }

      return;
    }

    // 다른 폴더의 알약이 이미 선택되어 있는 상태에서 새 폴더의 알약을 체크한 경우
    const hasExistingFromAnotherFolder =
      tempSelectedSeqs.length > 0 &&
      activeSelectedFolderId !== null &&
      activeSelectedFolderId !== selectedFolderId;

    if (hasExistingFromAnotherFolder) {
      setTempSelectedSeqs([seq]);
      setActiveSelectedFolderId(selectedFolderId);
      onShowConflictToast();
      return;
    }

    // 같은 폴더 내 추가 선택
    setTempSelectedSeqs((prev) => [...prev, seq]);
    setActiveSelectedFolderId(selectedFolderId);
  };

  // 현재 활성 폴더 기준 화면에 표시할 선택 알약 목록
  const displayedSelectedSeqs = useMemo(() => {
    const isCurrentFolderActive = activeSelectedFolderId === selectedFolderId;
    return isCurrentFolderActive ? tempSelectedSeqs : [];
  }, [activeSelectedFolderId, selectedFolderId, tempSelectedSeqs]);

  // 현재 폴더 알약 전체 목록 시퀀스
  const allFolderSeqs = useMemo(
    () => folderPills.map((p) => p.item_seq),
    [folderPills],
  );

  // 전체 선택 여부 계산
  const isAllSelected =
    allFolderSeqs.length > 0 &&
    displayedSelectedSeqs.length > 0 &&
    allFolderSeqs.every((seq) => displayedSelectedSeqs.includes(seq));

  // 전체 선택 / 전체 해제 핸들러
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setTempSelectedSeqs([]);
      setActiveSelectedFolderId(null);
      return;
    }

    const hasExistingFromAnotherFolder =
      tempSelectedSeqs.length > 0 &&
      activeSelectedFolderId !== null &&
      activeSelectedFolderId !== selectedFolderId;

    if (hasExistingFromAnotherFolder) {
      setTempSelectedSeqs(allFolderSeqs);
      setActiveSelectedFolderId(selectedFolderId);
      onShowConflictToast();
      return;
    }

    setTempSelectedSeqs(allFolderSeqs);
    setActiveSelectedFolderId(selectedFolderId);
  };

  return {
    activeSelectedFolderId,
    tempSelectedSeqs,
    displayedSelectedSeqs,
    isAllSelected,
    setActiveSelectedFolderId,
    toggleSelect,
    toggleSelectAll,
  };
};
