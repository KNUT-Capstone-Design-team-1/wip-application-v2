import { useState, useCallback, useRef } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { usePillDetail } from './use_pill_detail';
import { usePillDetailScreenInit } from './use_pill_detail_screen_init';
import { usePillBox } from '@features/pill_save/hooks/use_pill_box';
import { IPillDetail } from '../types/pill_detail_type';

// 상세 화면 데이터·저장 모달 상태 연결.
export const usePillDetailScreen = () => {
  const isSave = useRef(false);
  const { itemImage, ITEM_SEQ } = useLocalSearchParams();
  const itemSeqStr = Array.isArray(ITEM_SEQ) ? ITEM_SEQ[0] : ITEM_SEQ;
  const itemImageStr = Array.isArray(itemImage) ? itemImage[0] : itemImage;
  const [pillData, setPillData] = useState<IPillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFolderModalVisible, setFolderModalVisible] = useState(false);
  const { loadPillDetail, detailLoading } = usePillDetail();
  const { savedFolderIds, isSaved, checkSavedStatus } = usePillBox(
    pillData?.ITEM_SEQ ?? '',
  );
  usePillDetailScreenInit({
    itemSeq: itemSeqStr,
    pillData,
    loading,
    isSave,
    loadPillDetail,
    setLoading,
    setPillData,
  });

  const openFolderModal = useCallback(() => {
    if (!pillData) {
      return;
    }

    setFolderModalVisible(true);
  }, [pillData]);

  const closeFolderModal = useCallback(() => {
    setFolderModalVisible(false);
  }, []);

  const handleSaveComplete = useCallback(() => {
    isSave.current = true;
    checkSavedStatus(); // Refresh saved status after modal closes
  }, [checkSavedStatus]);

  return {
    pillData,
    loading,
    itemImageStr,
    isSaved, // passed down as saveState
    savedFolderIds,
    isFolderModalVisible,
    openFolderModal,
    closeFolderModal,
    handleSaveComplete,
    detailLoading,
  };
};
