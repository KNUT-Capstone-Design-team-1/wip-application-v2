import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppInitStore } from '../store/app_init_store';
import { databaseDownloadService } from '../services/database_download_service';
import logger from '@utils/logger';

// AppState 변화를 감지하여 포그라운드 복귀 시 백그라운드에서 수신된 업데이트 상태를 스토어에 동기화
export const useAppLifecycle = (
  _currentTableIndexRef?: React.RefObject<number>,
) => {
  const {
    status,
    updateStatus,
    setOverallProgress,
    setUpdateCurrentTable,
    setUpdateCurrentPage,
    setTotalPages,
  } = useAppInitStore();

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState: AppStateStatus) => {
        logger.info(`[APP-LIFECYCLE] AppState changed to: ${nextAppState}`);

        const isEnteringForeground: boolean = nextAppState === 'active';

        // 포그라운드로 복귀 시 저장된 백그라운드 업데이트 상태 조회 및 스토어 동기화
        if (isEnteringForeground) {
          const persistedState =
            await databaseDownloadService.loadUpdateState();
          const hasPersistedState: boolean = Boolean(persistedState);

          if (hasPersistedState) {
            logger.info(
              `[APP-LIFECYCLE] Resumed in foreground, syncing state: table=${persistedState!.currentTable}, progress=${persistedState!.overallProgress}`,
            );

            const hasCurrentTable: boolean = Boolean(
              persistedState!.currentTable,
            );
            const hasCurrentPage: boolean =
              typeof persistedState!.currentPage === 'number';
            const hasTotalPages: boolean =
              typeof persistedState!.totalPages === 'number';
            const hasOverallProgress: boolean =
              typeof persistedState!.overallProgress === 'number';

            if (hasCurrentTable) {
              setUpdateCurrentTable(persistedState!.currentTable as any);
            }
            if (hasCurrentPage) {
              setUpdateCurrentPage(persistedState!.currentPage);
            }
            if (hasTotalPages) {
              setTotalPages(persistedState!.totalPages);
            }
            if (hasOverallProgress) {
              setOverallProgress(persistedState!.overallProgress);
            }
          }
        }
      },
    );

    return () => subscription.remove();
  }, [
    status,
    updateStatus,
    setOverallProgress,
    setUpdateCurrentTable,
    setUpdateCurrentPage,
    setTotalPages,
  ]);
};
