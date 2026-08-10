import { useEffect } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppInitStore } from '../store/app_init_store';
import { initDatabase } from '@services/database';
import { AppConfigService } from '@services/index';
import { ALL_DATA_TABLES, TDataTable } from '@services/database/types';
import logger from '@utils/logger';
import { IUpdateProgress } from '../types';

// 초기 부팅 시 설정 로드, DB 초기화 및 중단된 업데이트 상태 복구를 처리하는 훅
export const useAppBoot = (
  currentTableIndexRef: React.RefObject<number>,
  setUpdateProgress: React.Dispatch<React.SetStateAction<IUpdateProgress>>,
  setIsInitializing: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const { setStatus, setUpdateCurrentTable, setUpdateCurrentPage } =
    useAppInitStore();

  useEffect(() => {
    const boot = async () => {
      try {
        setUpdateProgress({
          status: '서버 연결 중',
          progress: 0,
          isUpdating: false,
        });

        await AppConfigService.loadExternalConfig();

        setUpdateProgress({
          status: '데이터 동기화 시작',
          progress: 0,
          isUpdating: false,
        });

        const initDatabaseSuccess = await initDatabase();
        if (!initDatabaseSuccess) {
          throw new Error('Database initialization failed');
        }

        const pausedTable = await AsyncStorage.getItem('pausedTable');
        const pausedPage = await AsyncStorage.getItem('pausedPage');
        const pausedTableIndex = await AsyncStorage.getItem('pausedTableIndex');

        if (pausedTable && pausedPage && pausedTableIndex) {
          setUpdateCurrentTable(pausedTable as TDataTable);
          setUpdateCurrentPage(parseInt(pausedPage, 10));
          currentTableIndexRef.current = parseInt(pausedTableIndex, 10);
        } else {
          setUpdateCurrentTable(ALL_DATA_TABLES[0]);
          setUpdateCurrentPage(1);
          currentTableIndexRef.current = 0;
        }

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
  ]);
};
