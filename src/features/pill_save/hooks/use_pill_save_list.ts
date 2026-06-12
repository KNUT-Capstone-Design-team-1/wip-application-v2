import { useState, useCallback } from 'react';
import { IPillSaveData } from '@features/pill_save/types/pill_save_type';
import { pillSaveService } from '../services/pill_save_service';
import logger from '@utils/logger';
import { useFocusEffect } from 'expo-router';

/**
 * 저장된 알약 리스트 관리 훅
 */
export const usePillSaveList = () => {
  const [pillSaveData, setPillSaveData] = useState<IPillSaveData[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * 저장된 데이터 가져오기
   */
  const getSaveData = async () => {
    try {
      setLoading(true);

      const savedList = await pillSaveService.getSavedPills();

      setPillSaveData(savedList);
    } catch (e) {
      logger.error(
        `[SAVE-PILL-LIST] Failed to load save data. ${e.stack || e}`,
      );

      setPillSaveData([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 특정 알약 저장 삭제
   */
  const deleteSaveData = useCallback(async (itemSeq: string) => {
    try {
      const nextList = await pillSaveService.deletePill(itemSeq);

      setPillSaveData(nextList);
    } catch (e) {
      logger.error(
        `[SAVE-PILL-LIST] Failed to delete save data. ${e.stack || e}`,
      );
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getSaveData();
    }, []),
  );

  return {
    pillSaveData,
    loading,
    refreshData: getSaveData,
    deleteSaveData,
  };
};
