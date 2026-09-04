import { useState, useCallback, useEffect, useMemo } from 'react';
import { pillSaveService } from '@features/pill_save/services/pill_save_service';
import { IPillSaveData } from '@features/pill_save/types/pill_save_type';
import { useToast } from '@hooks/use_toast';
import { useCommonModalStore } from '@store/common_modal_store';

// 특정 폴더 내부의 알약 목록 관리 및 다중 선택(이동/복사/삭제) 로직 커스텀 훅 (Presentation Layer)
export const usePillSaveFolderDetail = (folderId: number) => {
  const [pillSaveData, setPillSaveData] = useState<IPillSaveData[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedSeqs, setSelectedSeqs] = useState<string[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'move' | 'copy'>('move');

  const { showToast } = useToast();

  // 폴더 내 알약 목록 불러오기
  const loadData = useCallback(async () => {
    const isInvalidFolderId = isNaN(folderId);

    if (isInvalidFolderId) {
      return;
    }

    setLoading(true);
    const data = await pillSaveService.getPillsByFolder(folderId);
    setPillSaveData(data);
    setLoading(false);
  }, [folderId]);

  // 폴더 ID 변경 시 데이터 재호출
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 편집 모드 켜기/끄기 토글
  const toggleEdit = useCallback(() => {
    setIsEditing((prev) => !prev);
    setSelectedSeqs([]);
  }, []);

  // 전체 선택 여부 계산
  const allSelected = useMemo(() => {
    const hasData = pillSaveData.length > 0;
    return hasData && selectedSeqs.length === pillSaveData.length;
  }, [pillSaveData.length, selectedSeqs.length]);

  // 전체 선택 / 전체 해제 핸들러
  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedSeqs([]);
      setIsEditing(false);
    } else {
      setSelectedSeqs(pillSaveData.map((item) => item.ITEM_SEQ));
    }
  }, [allSelected, pillSaveData]);

  // 개별 알약 선택/해제 토글 핸들러
  const handleItemSelect = useCallback((itemSeq: string) => {
    setSelectedSeqs((prev) => {
      const isCurrentlySelected = prev.includes(itemSeq);
      const next = isCurrentlySelected
        ? prev.filter((seq) => seq !== itemSeq)
        : [...prev, itemSeq];

      const shouldExitEditing = isCurrentlySelected && next.length === 0;

      if (shouldExitEditing) {
        setIsEditing(false);
      }

      return next;
    });
  }, []);

  // 선택된 알약 다른 폴더로 이동 모드 진입 핸들러
  const handleMove = useCallback(() => {
    const hasNoSelected = selectedSeqs.length === 0;

    if (hasNoSelected) {
      showToast({ type: 'error', message: '이동할 알약을 선택해주세요.' });
      return;
    }

    setModalMode('move');
    setIsModalVisible(true);
  }, [selectedSeqs.length, showToast]);

  // 선택된 알약 다른 폴더로 복사 모드 진입 핸들러
  const handleCopy = useCallback(() => {
    const hasNoSelected = selectedSeqs.length === 0;

    if (hasNoSelected) {
      showToast({ type: 'error', message: '복사할 알약을 선택해주세요.' });
      return;
    }

    setModalMode('copy');
    setIsModalVisible(true);
  }, [selectedSeqs.length, showToast]);

  // 이동/복사 모달 완료 후 처리 핸들러
  const handleSaveComplete = useCallback(() => {
    setIsModalVisible(false);
    setIsEditing(false);
    setSelectedSeqs([]);
    loadData();
  }, [loadData]);

  // 선택된 알약들 일괄 삭제 처리 핸들러
  const handleMultipleDelete = useCallback(() => {
    const hasNoSelected = selectedSeqs.length === 0;

    if (hasNoSelected) {
      showToast({ type: 'error', message: '삭제할 알약을 선택해주세요.' });
      return;
    }

    useCommonModalStore.getState().showModal({
      title: '알약 삭제',
      message: '선택한 알약을 삭제 하시겠습니까?',
      confirmStyle: 'destructive',
      // 삭제 확인 시 일괄 삭제 실행
      onConfirm: async () => {
        const isDeleted = await pillSaveService.deleteMultiplePillsFromFolder(
          selectedSeqs,
          folderId,
        );

        if (!isDeleted) {
          showToast({
            type: 'error',
            message: '알약 삭제에 실패했습니다.',
          });
          return;
        }

        setPillSaveData((prev) =>
          prev.filter((item) => !selectedSeqs.includes(item.ITEM_SEQ)),
        );

        setSelectedSeqs([]);
        setIsEditing(false);
        showToast({ type: 'default', message: '삭제되었습니다.' });
      },
    });
  }, [selectedSeqs, folderId, showToast]);

  // 배경 클릭 시 편집 모드 해제 핸들러
  const handleBackgroundPress = useCallback(() => {
    if (isEditing) {
      toggleEdit();
    }
  }, [isEditing, toggleEdit]);

  return {
    pillSaveData,
    loading,
    isEditing,
    selectedSeqs,
    isModalVisible,
    setIsModalVisible,
    modalMode,
    allSelected,
    toggleEdit,
    handleSelectAll,
    handleItemSelect,
    handleMove,
    handleCopy,
    handleSaveComplete,
    handleMultipleDelete,
    handleBackgroundPress,
  };
};
