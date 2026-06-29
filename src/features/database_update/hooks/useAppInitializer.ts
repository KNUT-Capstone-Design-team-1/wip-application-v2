import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppInitStore } from '../store/app_init_store';
import { initDatabase } from '@services/database';
import logger from '@utils/logger';
import {
  TDataTable,
  ALL_DATA_TABLES,
  TABLE_NAME_MAP,
} from '@services/database/types';
import { DatabaseUpdateService, AppConfigService } from '@services/index';
import { useEffect, useState, useRef } from 'react';
import { IUpdateProgress } from '../types';
import { useToast } from '@hooks/use_toast';

const DATABASE_INIT_STATUS = {
  COMPLETE: '완료',
} as const;

/**
 * 앱 초기화 로직 담당 커스텀 훅 (외부 설정 로드 및 데이터베이스 초기화/업데이트 관리)
 * @returns 초기화 진행 상세 상태
 */
export const useAppInitializer = () => {
  const { showToast } = useToast();
  const [isInitializing, setIsInitializing] = useState(true);
  const [updateProgress, setUpdateProgress] = useState<IUpdateProgress>({
    status: 'DB 초기화 중',
    progress: 0,
  });

  const {
    status,
    setStatus,
    updateCurrentTable,
    updateCurrentPage,
    setUpdateCurrentTable,
    setUpdateCurrentPage,
    setTotalPages,
    setOverallProgress,
  } = useAppInitStore();

  const currentTableIndexRef = useRef(0);
  const updateCheckRef = useRef<any>(null);
  const expectedTotalCountRef = useRef<number>(0);

  // AppState 변화 감지하여 PAUSED / RUNNING 상태 전환
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState: AppStateStatus) => {
        if (nextAppState === 'background' || nextAppState === 'inactive') {
          if (useAppInitStore.getState().status === 'RUNNING') {
            setStatus('PAUSED');
            await AsyncStorage.setItem(
              'pausedTable',
              useAppInitStore.getState().updateCurrentTable || '',
            );
            await AsyncStorage.setItem(
              'pausedPage',
              useAppInitStore.getState().updateCurrentPage.toString(),
            );
            await AsyncStorage.setItem(
              'pausedTableIndex',
              currentTableIndexRef.current.toString(),
            );
          }
        } else if (nextAppState === 'active') {
          if (useAppInitStore.getState().status === 'PAUSED') {
            setStatus('RUNNING');
          }
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [setStatus]);

  // 첫 부팅 시 초기화 로직 (AsyncStorage에서 중단된 작업 복구)
  useEffect(() => {
    const boot = async () => {
      try {
        setUpdateProgress({ status: '외부 설정 정보 로드 중', progress: 0 });
        await AppConfigService.loadExternalConfig();

        setUpdateProgress({ status: 'DB 초기화 중', progress: 0.05 });
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

        if (AppState.currentState === 'active') {
          setStatus('RUNNING');
        } else {
          setStatus('PAUSED');
        }
      } catch (e) {
        logger.error(`Failed to init Database. ${(e as Error).stack || e}`);
        setUpdateProgress({ status: '데이터베이스 초기화 실패', progress: 0 });
        setIsInitializing(false);
      }
    };

    boot();
  }, [setStatus, setUpdateCurrentTable, setUpdateCurrentPage]);

  // RUNNING 상태일 때 동작하는 State-Driven 루프
  useEffect(() => {
    if (status !== 'RUNNING') return;
    if (!updateCurrentTable) return;

    let isCancelled = false;

    const processNext = async () => {
      try {
        // 첫 페이지일 경우 업데이트 필요 여부 체크 및 테이블 초기화
        if (updateCurrentPage === 1) {
          const updateCheck =
            await DatabaseUpdateService.checkRequireTableUpdate(
              updateCurrentTable,
            );
          if (updateCheck.code !== 'REQUIRE-UPDATE') {
            console.log(`No update required for ${updateCurrentTable}`);
            moveToNextTable();
            return;
          }
          updateCheckRef.current = updateCheck;

          setUpdateProgress({
            status: `${TABLE_NAME_MAP[updateCurrentTable]} 테이블 초기화 중`,
            progress: currentTableIndexRef.current / ALL_DATA_TABLES.length,
          });

          const initResult =
            await DatabaseUpdateService.initTable(updateCurrentTable);
          if (initResult !== 'OK') {
            throw new Error(`Failed init table ${updateCurrentTable}`);
          }
        }

        // 데이터 삽입 (1페이지씩)
        const insertResult = await DatabaseUpdateService.insertData(
          updateCurrentPage,
          updateCurrentTable,
        );

        if (insertResult.code !== 'OK') {
          throw new Error(`Failed to insert data into ${updateCurrentTable}`);
        }

        // 전체 카운트 저장 (첫 페이지일 때 혹은 매번)
        expectedTotalCountRef.current = insertResult.total;

        const newTotalPages = insertResult.totalPage;
        setTotalPages(newTotalPages);

        const tableUpdateProgress = updateCurrentPage / newTotalPages;
        const newOverallProgress =
          (currentTableIndexRef.current + tableUpdateProgress) /
          ALL_DATA_TABLES.length;

        setOverallProgress(newOverallProgress);
        setUpdateProgress({
          status: `${TABLE_NAME_MAP[updateCurrentTable]} 데이터 다운로드 중`,
          progress: newOverallProgress,
          currentPage: updateCurrentPage,
          totalPages: newTotalPages,
        });

        if (isCancelled) return;

        if (updateCurrentPage < newTotalPages) {
          // 다음 페이지로 상태 업데이트 (이로 인해 useEffect가 재실행됨)
          setUpdateCurrentPage(updateCurrentPage + 1);
        } else {
          // --- [검증 로직 추가] ---
          const actualCount =
            await DatabaseUpdateService.getTableRowCount(updateCurrentTable);
          const expectedCount = expectedTotalCountRef.current;

          if (actualCount !== expectedCount) {
            throw new Error(
              `[VERIFICATION_FAILED] ${updateCurrentTable} 테이블 데이터 유실됨. (기대값: ${expectedCount}, 실제값: ${actualCount})`,
            );
          }
          // -------------------------

          // 현재 테이블 데이터 삽입 완료
          if (updateCheckRef.current) {
            await DatabaseUpdateService.updateDatabaseVersion(
              updateCurrentTable,
              updateCheckRef.current.newSchemaVersion,
              updateCheckRef.current.newDataVersion,
            );
            updateCheckRef.current = null;
          }
          console.log(`Complete update table ${updateCurrentTable}`);
          moveToNextTable();
        }
      } catch (e) {
        if (isCancelled) return;

        const errorMessage = (e as Error).message || '';
        if (errorMessage.includes('[VERIFICATION_FAILED]')) {
          logger.error(
            `Verification failed for ${updateCurrentTable}. Restarting table update. Error: ${errorMessage}`,
          );

          showToast({
            message: '데이터 동기화 누락이 발견되어 해당 작업을 재시작합니다.',
          });

          // 해당 테이블 1페이지부터 다시 시작하도록 상태 롤백
          await DatabaseUpdateService.initTable(updateCurrentTable);
          setUpdateCurrentPage(1);
          // status는 여전히 RUNNING이므로 다음 렌더 사이클에서 1페이지부터 재시작됨
          return;
        }

        logger.error(`Error during insert data: ${(e as Error).stack || e}`);
        setStatus('ERROR');
        showToast({
          message: 'DB 업데이트 중 오류가 발생했습니다. 앱을 재시작해 주세요.',
        });
      }
    };

    const moveToNextTable = async () => {
      currentTableIndexRef.current += 1;
      await AsyncStorage.removeItem('pausedTable');
      await AsyncStorage.removeItem('pausedPage');
      await AsyncStorage.removeItem('pausedTableIndex');

      if (currentTableIndexRef.current < ALL_DATA_TABLES.length) {
        setUpdateCurrentTable(ALL_DATA_TABLES[currentTableIndexRef.current]);
        setUpdateCurrentPage(1);
      } else {
        // 모든 테이블 업데이트 완료
        setStatus('COMPLETED');
        setUpdateProgress({
          status: DATABASE_INIT_STATUS.COMPLETE,
          progress: 1,
        });
        setTimeout(() => {
          setIsInitializing(false);
        }, 500);
      }
    };

    processNext();

    return () => {
      isCancelled = true;
    };
  }, [
    status,
    updateCurrentTable,
    updateCurrentPage,
    setStatus,
    setTotalPages,
    setOverallProgress,
    setUpdateCurrentTable,
    setUpdateCurrentPage,
  ]);

  return { isInitializing, updateProgress };
};
