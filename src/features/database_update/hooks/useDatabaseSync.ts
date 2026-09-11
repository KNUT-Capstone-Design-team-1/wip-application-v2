import { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppInitStore } from '../store/app_init_store';
import { databaseSyncOrchestrator } from '../services/database_sync_orchestrator';
import { useToast } from '@hooks/use_toast';
import { IUpdateProgress } from '../types';

let isSyncRunning: boolean = false; // 중복 동기화 방지용 뮤텍스 플래그

// 데이터베이스 동기화 프로세스를 실행하고 UI 상태와 연동하는 커스텀 훅
export const useDatabaseSync = (
  currentTableIndexRef: React.RefObject<number>,
  setUpdateProgress: React.Dispatch<React.SetStateAction<IUpdateProgress>>,
  setIsInitializing: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const { showToast } = useToast();
  const status = useAppInitStore((state) => state.status);
  const tablesToUpdate = useAppInitStore((state) => state.tablesToUpdate);

  const isCancelledRef = useRef(false);

  const runSync = useCallback(async () => {
    const isReadyToSync: boolean =
      status === 'RUNNING' && tablesToUpdate.length > 0;
    const shouldSkip: boolean = !isReadyToSync || isSyncRunning;

    if (shouldSkip) {
      return;
    }

    isCancelledRef.current = false;
    isSyncRunning = true;

    try {
      const {
        setStatus,
        setUpdateStatus,
        setUpdateCurrentTable,
        setUpdateCurrentPage,
        setTotalPages,
        setOverallProgress,
        setErrorMessage,
      } = useAppInitStore.getState();

      await databaseSyncOrchestrator.runPipeline(
        tablesToUpdate,
        currentTableIndexRef,
        () => isCancelledRef.current,
        {
          setUpdateProgress,
          setUpdateCurrentTable,
          setUpdateCurrentPage,
          setTotalPages,
          setOverallProgress,
          setUpdateStatus,
          setStatus,
          setErrorMessage,
          setIsInitializing,
          showToast,
        },
      );
    } finally {
      isSyncRunning = false;
    }
  }, [
    status,
    tablesToUpdate,
    currentTableIndexRef,
    setUpdateProgress,
    setIsInitializing,
    showToast,
  ]);

  useEffect(() => {
    runSync();

    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        const isEnteringForeground: boolean = nextAppState === 'active';
        if (isEnteringForeground) {
          runSync();
        }
      },
    );

    return () => {
      subscription.remove();
      isCancelledRef.current = true;
      isSyncRunning = false;
    };
  }, [runSync]);
};
