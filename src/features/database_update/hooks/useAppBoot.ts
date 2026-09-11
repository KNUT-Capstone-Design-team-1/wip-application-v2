import { useEffect, useRef } from 'react';
import { useAppInitStore } from '../store/app_init_store';
import { databaseBootstrapService } from '../services/database_bootstrap_service';
import logger from '@utils/logger';
import { IUpdateProgress } from '../types';

// 앱 초기화 및 데이터베이스 동기화 부트스트랩 훅
export const useAppBoot = (
  _currentTableIndexRef: React.RefObject<number>,
  setUpdateProgress: React.Dispatch<React.SetStateAction<IUpdateProgress>>,
  setIsInitializing: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const isBootedRef = useRef(false);
  const { setStatus, setTablesToUpdate, setUpdateStatus } = useAppInitStore();

  useEffect(() => {
    const isAlreadyBooted: boolean = isBootedRef.current;
    if (isAlreadyBooted) return;
    isBootedRef.current = true;

    const boot = async () => {
      try {
        await databaseBootstrapService.executeInitialSetup(setUpdateProgress);

        const tablesToUpdate =
          await databaseBootstrapService.checkAndPromptUpdates(
            setUpdateProgress,
          );
        const hasNoUpdates: boolean =
          tablesToUpdate === null || tablesToUpdate.length === 0;

        if (hasNoUpdates || !tablesToUpdate) {
          setStatus('COMPLETED');
          setUpdateStatus('completed');
          setIsInitializing(false);
          return;
        }

        setTablesToUpdate(tablesToUpdate);
        setUpdateProgress({
          status: '데이터 동기화 준비 중',
          progress: 0,
          isUpdating: true,
        });

        setStatus('RUNNING');
        setUpdateStatus('downloading');
      } catch (e) {
        logger.error(`Failed to init Database. ${(e as Error).stack || e}`);
        setUpdateProgress({
          status: '데이터 동기화 실패',
          progress: 0,
          isUpdating: false,
        });
        setStatus('ERROR');
        setUpdateStatus('failed');
        setIsInitializing(false);
      }
    };

    boot();
  }, [
    setStatus,
    setTablesToUpdate,
    setUpdateStatus,
    setUpdateProgress,
    setIsInitializing,
  ]);
};
