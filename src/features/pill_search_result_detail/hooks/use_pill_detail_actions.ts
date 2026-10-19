import { useCallback, useMemo } from 'react';
import { pillSaveService } from '@features/pill_save/services/pill_save_service';
import logger from '@utils/logger';
import { pillDetailService } from '../services/pill_detail_service';
import { createPillDetailLoader } from '../utils/pill_detail_loader';
import { usePillDetailContext } from './use_pill_detail_context';

// 구독 없는 상세 조회·취소 명령.
export const usePillDetailLoadActions = () => {
  const store = usePillDetailContext();

  const loader = useMemo(
    () => createPillDetailLoader(store, pillDetailService),
    [store],
  );

  const load = useCallback(async () => {
    try {
      await loader.load();
    } catch (error) {
      logger.error(
        'Failed to load pill detail. ' +
          (error instanceof Error ? error.stack : error),
      );
    }
  }, [loader]);

  const cancel = useCallback(() => loader.cancel(), [loader]);

  return { load, cancel };
};

// 저장 상태 조회·폴더 모달 명령.
export const usePillDetailSaveActions = () => {
  const store = usePillDetailContext();

  const refreshSavedFolders = useCallback(async () => {
    const { itemSeq, setSavedFolderIds } = store.getState();

    if (!itemSeq) {
      setSavedFolderIds([]);

      return;
    }

    try {
      setSavedFolderIds(await pillSaveService.getPillSavedFolderIds(itemSeq));
    } catch (error) {
      logger.error(
        'Failed to check saved status. ' +
          (error instanceof Error ? error.stack : error),
      );
      setSavedFolderIds([]);
    }
  }, [store]);

  const openFolderModal = useCallback(() => {
    if (!store.getState().pillData) {
      return;
    }

    store.getState().setFolderModalVisible(true);
  }, [store]);

  const closeFolderModal = useCallback(
    () => store.getState().setFolderModalVisible(false),
    [store],
  );

  const completeSave = useCallback(() => {
    store.getState().setHasSaved(true);
    void refreshSavedFolders();
  }, [store, refreshSavedFolders]);

  return {
    refreshSavedFolders,
    openFolderModal,
    closeFolderModal,
    completeSave,
  };
};
