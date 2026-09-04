import { useEffect } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppInitStore } from '../store/app_init_store';
import { initDatabase } from '@services/database';
import { AppConfigService } from '@services/index';
import { TDataTable } from '@services/database/types';
import logger from '@utils/logger';
import { IUpdateProgress } from '../types';
import {
  getRequiredDatabaseUpdates,
  IUpdateNeeded,
} from '../utils/updateCheck';

// 앱 초기 부팅 시 외부 설정 로드 및 데이터베이스 초기화
const executeInitialSetup = async (
  setUpdateProgress: React.Dispatch<React.SetStateAction<IUpdateProgress>>,
) => {
  setUpdateProgress({ status: '서버 연결 중', progress: 0, isUpdating: false });

  await AppConfigService.loadExternalConfig();

  setUpdateProgress({
    status: '데이터 동기화 준비 중',
    progress: 0,
    isUpdating: false,
  });

  await initDatabase();
};

// 사용자에게 업데이트 확인 모달 띄우기 (확인: true, 취소: false 반환)
const promptUserForUpdate = async (
  updatesNeeded: IUpdateNeeded[],
): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    useAppInitStore.getState().setUpdateModal(updatesNeeded, resolve);
  });
};

// DB 업데이트 여부 확인 및 필요 시 모달 노출
const checkAndPromptUpdates = async (
  setUpdateProgress: React.Dispatch<React.SetStateAction<IUpdateProgress>>,
): Promise<IUpdateNeeded[] | null> => {
  setUpdateProgress({
    status: '업데이트 확인 중',
    progress: 0,
    isUpdating: false,
  });

  const { updatesNeeded, isForceUpdate } = await getRequiredDatabaseUpdates();

  if (updatesNeeded.length === 0) {
    return null;
  }

  const pausedTable = await AsyncStorage.getItem('pausedTable');
  const pausedPage = await AsyncStorage.getItem('pausedPage');

  const hasValidPausedState =
    pausedTable &&
    pausedPage &&
    updatesNeeded.some((u) => u.table === pausedTable);

  if (isForceUpdate || hasValidPausedState) {
    return updatesNeeded; // 사용자 확인 없이 강제 진행
  }

  const isConfirmed = await promptUserForUpdate(updatesNeeded);
  return isConfirmed ? updatesNeeded : null;
};

// 중단된 업데이트 상태(AsyncStorage) 복구 또는 초기화
const restoreUpdateState = async (
  setUpdateCurrentTable: (table: TDataTable) => void,
  setUpdateCurrentPage: (page: number) => void,
  currentTableIndexRef: React.RefObject<number>,
  tablesToUpdate: IUpdateNeeded[],
) => {
  const pausedTable = await AsyncStorage.getItem('pausedTable');
  const pausedPage = await AsyncStorage.getItem('pausedPage');

  const hasValidPausedState =
    pausedTable &&
    pausedPage &&
    tablesToUpdate.some((u) => u.table === pausedTable);

  if (hasValidPausedState) {
    setUpdateCurrentTable(pausedTable as TDataTable);
    setUpdateCurrentPage(parseInt(pausedPage, 10));
    currentTableIndexRef.current = tablesToUpdate.findIndex(
      (u) => u.table === pausedTable,
    );
    return;
  }

  setUpdateCurrentTable(tablesToUpdate[0].table as TDataTable);
  setUpdateCurrentPage(1);
  currentTableIndexRef.current = 0;
};

// 앱 초기화 및 데이터베이스 동기화 오케스트레이터 훅
export const useAppBoot = (
  currentTableIndexRef: React.RefObject<number>,
  setUpdateProgress: React.Dispatch<React.SetStateAction<IUpdateProgress>>,
  setIsInitializing: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const {
    setStatus,
    setUpdateCurrentTable,
    setUpdateCurrentPage,
    setTablesToUpdate,
  } = useAppInitStore();

  useEffect(() => {
    const boot = async () => {
      try {
        await executeInitialSetup(setUpdateProgress);

        const tablesToUpdate = await checkAndPromptUpdates(setUpdateProgress);

        if (!tablesToUpdate || tablesToUpdate.length === 0) {
          setStatus('COMPLETED');
          setIsInitializing(false);
          return;
        }

        setTablesToUpdate(tablesToUpdate);

        setUpdateProgress({
          status: '데이터 동기화 시작',
          progress: 0,
          isUpdating: false,
        });

        await restoreUpdateState(
          setUpdateCurrentTable,
          setUpdateCurrentPage,
          currentTableIndexRef,
          tablesToUpdate,
        );

        setStatus(AppState.currentState === 'active' ? 'RUNNING' : 'PAUSED');
      } catch (e) {
        logger.error(`Failed to init Database. ${(e as Error).stack || e}`);
        setUpdateProgress({
          status: '데이터 동기화 실패',
          progress: 0,
          isUpdating: false,
        });
        setIsInitializing(false);
      }
    };

    boot();
  }, [
    setStatus,
    setUpdateCurrentTable,
    setUpdateCurrentPage,
    setUpdateProgress,
    setIsInitializing,
    currentTableIndexRef,
    setTablesToUpdate,
  ]);
};
