import { useState, useCallback, useEffect } from 'react';
import { pillSaveService } from '@features/pill_save/services/pill_save_service';
import { IPillSaveData } from '@features/pill_save/types/pill_save_type';
import { useToast } from '@hooks/use_toast';

// 특정 폴더 내부의 알약 목록 관리 및 다중 선택(이동/복사/삭제) 로직을 담당하는 커스텀 훅
export const usePillSaveFolderDetail = (folderId: number) => {
  const [pillSaveData, setPillSaveData] = useState<IPillSaveData[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedSeqs, setSelectedSeqs] = useState<string[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'move' | 'copy'>('move');

  const { showToast } = useToast();

  // 알약 목록 불러오기
  const loadData = useCallback(async () => {
    if (isNaN(folderId)) {
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
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setSelectedSeqs([]);
  };

  const allSelected =
    pillSaveData.length > 0 && selectedSeqs.length === pillSaveData.length;

  // 전체 선택 / 전체 해제
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedSeqs([]);
    } else {
      setSelectedSeqs(pillSaveData.map((item) => item.ITEM_SEQ));
    }
  };

  // 개별 알약 선택/해제 토글
  const handleItemSelect = (itemSeq: string) => {
    setSelectedSeqs((prev) =>
      prev.includes(itemSeq)
        ? prev.filter((seq) => seq !== itemSeq)
        : [...prev, itemSeq],
    );
  };

  // 선택된 알약 다른 폴더로 이동 모드 진입
  const handleMove = () => {
    if (selectedSeqs.length === 0) {
      showToast({ type: 'error', message: '이동할 알약을 선택해주세요.' });
      return;
    }

    setModalMode('move');
    setIsModalVisible(true);
  };

  // 선택된 알약 다른 폴더로 복사 모드 진입
  const handleCopy = () => {
    if (selectedSeqs.length === 0) {
      showToast({ type: 'error', message: '복사할 알약을 선택해주세요.' });
      return;
    }

    setModalMode('copy');
    setIsModalVisible(true);
  };

  // 이동/복사 모달 완료 후 처리
  const handleSaveComplete = () => {
    setIsModalVisible(false);
    setIsEditing(false);

    setSelectedSeqs([]);
    loadData();

    showToast({
      type: 'success',
      message: modalMode === 'move' ? '이동되었습니다.' : '복사되었습니다.',
    });
  };

  // 선택된 알약들 일괄 삭제 처리
  const handleMultipleDelete = async () => {
    if (selectedSeqs.length === 0) {
      showToast({ type: 'error', message: '삭제할 알약을 선택해주세요.' });
      return;
    }

    await pillSaveService.deleteMultiplePillsFromFolder(selectedSeqs, folderId);

    setPillSaveData((prev) =>
      prev.filter((item) => !selectedSeqs.includes(item.ITEM_SEQ)),
    );

    setSelectedSeqs([]);
    setIsEditing(false);

    showToast({ type: 'success', message: '삭제되었습니다.' });
  };

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
  };
};
