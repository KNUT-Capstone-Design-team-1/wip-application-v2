import { useEffect, useState, useCallback } from 'react';
import { pillSaveService } from '@features/pill_save/services/pill_save_service';
import logger from '@utils/logger';

/**
 * 개별 알약이 어느 폴더들에 저장되어 있는지 상태 관리하는 훅
 */
export const usePillBox = (itemSeq: string) => {
  const [savedFolderIds, setSavedFolderIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * 저장 여부 확인
   */
  const checkSavedStatus = useCallback(async () => {
    setLoading(true);
    try {
      const folderIds = await pillSaveService.getPillSavedFolderIds(itemSeq);
      setSavedFolderIds(folderIds);
    } catch (e: any) {
      logger.error(`Failed to check saved status. ${e.stack || e}`);
      setSavedFolderIds([]);
    } finally {
      setLoading(false);
    }
  }, [itemSeq]);

  useEffect(() => {
    checkSavedStatus();
  }, [checkSavedStatus]);

  return {
    savedFolderIds,
    isSaved: savedFolderIds.length > 0,
    checkSavedStatus,
    loading,
  };
};
