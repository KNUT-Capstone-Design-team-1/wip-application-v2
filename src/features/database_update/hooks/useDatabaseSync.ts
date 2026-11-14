import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useAppInitStore } from '../store/app_init_store';
import { databaseSyncOrchestrator } from '../services/database_sync_orchestrator';
import { enqueueDatabaseSync } from '../services/database_sync_queue';
import { useToast } from '@hooks/use_toast';
import logger from '@utils/logger';
import { IUpdateProgress } from '../types';

export const useDatabaseSync = (
  currentTableIndexRef: React.RefObject<number>,
  setUpdateProgress: React.Dispatch<React.SetStateAction<IUpdateProgress>>,
  setIsInitializing: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const { showToast } = useToast();
  const status = useAppInitStore((state) => state.status);
  const tablesToUpdate = useAppInitStore((state) => state.tablesToUpdate);

  useEffect(() => {
    // Cancellation belongs to this effect, not the next sync invocation.
    let cancelled = false;
    let queued = false;

    const runSync = async () => {
      if (cancelled || queued || status !== 'RUNNING' || !tablesToUpdate.length)
        return;
      queued = true;
      try {
        await enqueueDatabaseSync(
          async () => {
            const state = useAppInitStore.getState();
            if (state.status !== 'RUNNING' || !state.tablesToUpdate.length)
              return;
            await databaseSyncOrchestrator.runPipeline(
              state.tablesToUpdate,
              currentTableIndexRef,
              () => cancelled,
              {
                setUpdateProgress,
                setUpdateCurrentTable: state.setUpdateCurrentTable,
                setUpdateCurrentPage: state.setUpdateCurrentPage,
                setTotalPages: state.setTotalPages,
                setOverallProgress: state.setOverallProgress,
                setUpdateStatus: state.setUpdateStatus,
                setStatus: state.setStatus,
                setErrorMessage: state.setErrorMessage,
                setIsInitializing,
                showToast,
              },
            );
          },
          () => cancelled,
        );
      } catch (error) {
        logger.error('[SYNC] Failed to execute sync: ' + String(error));
      } finally {
        queued = false;
      }
    };

    void runSync();
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') void runSync();
    });
    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, [
    status,
    tablesToUpdate,
    currentTableIndexRef,
    setUpdateProgress,
    setIsInitializing,
    showToast,
  ]);
};
