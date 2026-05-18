import { useEffect, useState, useCallback } from 'react';
import { IPillSaveData } from '@features/pill_save/types/pill_save_type';
import { pillSaveService } from '@features/pill_save/services/pill_save_service';
import logger from '@utils/logger';

/**
 * 개별 알약 저장 상태 관리 및 토글 훅
 */
export const usePillBox = (itemSeq: string) => {
  const [saveState, setSaveState] = useState(false);

  /**
   * 저장 여부 확인
   */
  const checkSavedStatus = useCallback(async () => {
    try {
      const isSaved = await pillSaveService.isPillSaved(itemSeq);

      setSaveState(isSaved);
    } catch (e) {
      logger.error(`Failed to check saved status. ${e.stack || e}`);

      setSaveState(false);
    }
  }, [itemSeq]);

  useEffect(() => {
    checkSavedStatus();
  }, [checkSavedStatus]);

  /**
   * 저장 상태 토글
   */
  const toggleSave = useCallback(async (saveItem: IPillSaveData) => {
    try {
      const nextStatus = await pillSaveService.toggleSave(saveItem);

      setSaveState(nextStatus);
    } catch (e) {
      logger.error(`Failed to toggle save status. ${e.stack || e}`);
    }
  }, []);

  return { saveState, toggleSave };
};
