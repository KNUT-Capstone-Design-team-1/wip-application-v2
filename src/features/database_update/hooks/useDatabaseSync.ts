import { useEffect, useRef } from 'react';
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
  const {
    status,
    tablesToUpdate,
    setStatus,
    setUpdateStatus,
    setUpdateCurrentTable,
    setUpdateCurrentPage,
    setTotalPages,
    setOverallProgress,
    setErrorMessage,
  } = useAppInitStore();

  const isCancelledRef = useRef(false);

  useEffect(() => {
    const isReadyToSync: boolean =
      status === 'RUNNING' && tablesToUpdate.length > 0;
    const shouldSkip: boolean = !isReadyToSync || isSyncRunning;

    if (shouldSkip) {
      return;
    }

    isCancelledRef.current = false;
    isSyncRunning = true;

    const startSync = async () => {
      try {
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
    };

    startSync();

    return () => {
      isCancelledRef.current = true;
      isSyncRunning = false;
    };
  }, [
    status,
    tablesToUpdate,
    setStatus,
    setUpdateStatus,
    setUpdateCurrentTable,
    setUpdateCurrentPage,
    setTotalPages,
    setOverallProgress,
    setErrorMessage,
    setUpdateProgress,
    setIsInitializing,
    currentTableIndexRef,
    showToast,
  ]);
};
