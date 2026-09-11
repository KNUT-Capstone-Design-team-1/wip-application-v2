import { useEffect, useRef } from 'react';
import { useAppInitStore } from '../store/app_init_store';
import { databaseBootstrapService } from '../services/database_bootstrap_service';
import logger from '@utils/logger';
import {
  IUpdateProgress,
  IUpdateNeeded,
  InitStatus,
  DatabaseUpdateStatus,
} from '../types';

// 업데이트 대상이 없을 때 완료 상태 전환 처리
export const handleNoUpdatesRequired = (
  setStatus: (status: InitStatus) => void,
  setUpdateStatus: (status: DatabaseUpdateStatus) => void,
  setIsInitializing: React.Dispatch<React.SetStateAction<boolean>>,
): void => {
  setStatus('COMPLETED');
  setUpdateStatus('completed');
  setIsInitializing(false);
};

// 업데이트 대상이 존재할 때 수신 준비 상태 전환 처리
export const handleUpdatesReady = (
  tablesToUpdate: IUpdateNeeded[],
  setTablesToUpdate: (tables: IUpdateNeeded[]) => void,
  setStatus: (status: InitStatus) => void,
  setUpdateStatus: (status: DatabaseUpdateStatus) => void,
  setUpdateProgress: React.Dispatch<React.SetStateAction<IUpdateProgress>>,
): void => {
  setTablesToUpdate(tablesToUpdate);
  setUpdateProgress({
    status: '데이터 동기화 준비 중',
    progress: 0,
    isUpdating: true,
  });

  setStatus('RUNNING');
  setUpdateStatus('downloading');
};

// 부트스트랩 과정 실패 시 에러 처리
export const handleBootFailure = (
  e: unknown,
  setStatus: (status: InitStatus) => void,
  setUpdateStatus: (status: DatabaseUpdateStatus) => void,
  setUpdateProgress: React.Dispatch<React.SetStateAction<IUpdateProgress>>,
  setIsInitializing: React.Dispatch<React.SetStateAction<boolean>>,
): void => {
  logger.error(`Failed to init Database. ${(e as Error).stack || e}`);
  setUpdateProgress({
    status: '데이터 동기화 실패',
    progress: 0,
    isUpdating: false,
  });
  setStatus('ERROR');
  setUpdateStatus('failed');
  setIsInitializing(false);
};

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
          handleNoUpdatesRequired(
            setStatus,
            setUpdateStatus,
            setIsInitializing,
          );
          return;
        }

        handleUpdatesReady(
          tablesToUpdate,
          setTablesToUpdate,
          setStatus,
          setUpdateStatus,
          setUpdateProgress,
        );
      } catch (e) {
        handleBootFailure(
          e,
          setStatus,
          setUpdateStatus,
          setUpdateProgress,
          setIsInitializing,
        );
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
