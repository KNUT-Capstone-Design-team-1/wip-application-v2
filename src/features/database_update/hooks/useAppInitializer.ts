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

/**
 * 앱 초기화 로직 담당 커스텀 훅 (외부 설정 로드 및 데이터베이스 초기화/업데이트 관리)
 * @returns 초기화 진행 상세 상태
 */
export const useAppInitializer = () => {
  const { showToast } = useToast();

  const [isInitializing, setIsInitializing] = useState(true);

  const [updateProgress, setUpdateProgress] = useState<IUpdateProgress>({
    status: '데이터 동기화 준비 중',
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
        const isBackgroundOrInactive =
          nextAppState === 'background' || nextAppState === 'inactive';

        const isRunning = useAppInitStore.getState().status === 'RUNNING';

        const isPaused = useAppInitStore.getState().status === 'PAUSED';

        if (isBackgroundOrInactive && isRunning) {
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
          return;
        }

        if (nextAppState === 'active' && isPaused) {
          setStatus('RUNNING');
          return;
        }
      },
    );

    return () => subscription.remove();
  }, [setStatus]);

  // 첫 부팅 시 초기화 로직 (AsyncStorage에서 중단된 작업 복구)
  useEffect(() => {
    const boot = async () => {
      try {
        setUpdateProgress({ status: '서버 연결 중', progress: 0 });
        await AppConfigService.loadExternalConfig();

        setUpdateProgress({ status: '데이터 동기화 시작', progress: 0.05 });

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

        setUpdateProgress({ status: '데이터 동기화 실패', progress: 0 });

        setIsInitializing(false);
      }
    };

    boot();
  }, [setStatus, setUpdateCurrentTable, setUpdateCurrentPage]);

  // RUNNING 상태일 때 동작하는 State-Driven 루프
  useEffect(() => {
    if (status !== 'RUNNING' || !updateCurrentTable) {
      return;
    }

    let isCancelled = false;

    // 첫 페이지 접근 시 테이블 업데이트 필요 여부를 확인하고 초기화
    const checkAndUpdateFirstPage = async () => {
      if (updateCheckRef.current.code !== 'REQUIRE-UPDATE') {
        console.log(`No update required for ${updateCurrentTable}`);
        return false;
      }

      setUpdateProgress({
        status: `${TABLE_NAME_MAP[updateCurrentTable]} 데이터 동기화 진행중`,
        progress: currentTableIndexRef.current / ALL_DATA_TABLES.length,
      });

      const initResult =
        await DatabaseUpdateService.initTable(updateCurrentTable);

      if (initResult !== 'OK') {
        throw new Error(`Failed init table ${updateCurrentTable}`);
      }
      return true;
    };

    // 데이터 삽입 완료 후 누락된 데이터가 없는지 검증
    const verifyDataIntegrity = async () => {
      const actualCount =
        await DatabaseUpdateService.getTableRowCount(updateCurrentTable);

      const expectedCount = expectedTotalCountRef.current;

      if (actualCount !== expectedCount) {
        throw new Error(
          `[VERIFICATION_FAILED] ${updateCurrentTable} 테이블 데이터 유실. (기대값: ${expectedCount}, 실제값: ${actualCount})`,
        );
      }
    };

    // 테이블 업데이트가 성공적으로 완료되면 버전 정보를 저장
    const finalizeTableUpdate = async () => {
      if (updateCheckRef.current) {
        await DatabaseUpdateService.updateDatabaseVersion(
          updateCurrentTable,
          updateCheckRef.current.newSchemaVersion,
          updateCheckRef.current.newDataVersion,
        );

        updateCheckRef.current = null;
      }
      console.log(`Complete update table ${updateCurrentTable}`);
    };

    // 데이터 동기화 과정에서 발생한 에러를 처리하고 필요 시 재시도
    const handleError = async (e: any) => {
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
        return;
      }

      logger.error(`Error during insert data: ${(e as Error).stack || e}`);

      setStatus('ERROR');
      showToast({
        message: '데이터 동기화 중 오류가 발생했습니다. 앱을 재시작해 주세요.',
      });
    };

    // 현재 테이블 작업을 마치고 다음 테이블로 이동 (전체 완료 시 앱 진입 허용)
    const moveToNextTable = async () => {
      currentTableIndexRef.current += 1;

      await AsyncStorage.removeItem('pausedTable');
      await AsyncStorage.removeItem('pausedPage');
      await AsyncStorage.removeItem('pausedTableIndex');

      if (currentTableIndexRef.current >= ALL_DATA_TABLES.length) {
        setStatus('COMPLETED');
        setUpdateProgress({ status: '완료', progress: 1 });

        setTimeout(() => {
          setIsInitializing(false);
        }, 500);
        return;
      }

      setUpdateCurrentTable(ALL_DATA_TABLES[currentTableIndexRef.current]);
      setUpdateCurrentPage(1);
    };

    // 페이지 단위로 데이터를 조회하여 삽입하는 메인 루프 처리
    const processNext = async () => {
      try {
        // 일시정지 복구 시 updateCheckRef가 없으면 다시 조회하여 버전 정보를 채움
        if (!updateCheckRef.current) {
          updateCheckRef.current =
            await DatabaseUpdateService.checkRequireTableUpdate(
              updateCurrentTable,
            );
        }

        if (updateCurrentPage === 1) {
          const isUpdateRequired = await checkAndUpdateFirstPage();

          if (!isUpdateRequired) {
            await moveToNextTable();
            return;
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
          status: `${TABLE_NAME_MAP[updateCurrentTable]} 데이터 동기화 중`,
          progress: newOverallProgress,
          currentPage: updateCurrentPage,
          totalPages: newTotalPages,
        });

        if (isCancelled) {
          return;
        }

        if (updateCurrentPage < newTotalPages) {
          setUpdateCurrentPage(updateCurrentPage + 1); // 다음 페이지로 상태 업데이트 (이로 인해 useEffect가 재실행됨)
          return;
        }

        await verifyDataIntegrity();
        await finalizeTableUpdate();
        await moveToNextTable();
      } catch (e) {
        if (isCancelled) {
          return;
        }

        await handleError(e);
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
