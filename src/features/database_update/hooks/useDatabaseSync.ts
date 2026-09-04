import { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppInitStore } from '../store/app_init_store';
import { databaseUpdateService } from '../services/database_update_service';
import logger from '@utils/logger';
import { TABLE_NAME_MAP } from '@services/database/types';
import { useToast } from '@hooks/use_toast';
import { IUpdateProgress } from '../types';

// 실제 테이블별 데이터 동기화를 페이지 단위로 처리하는 메인 루프 훅
export const useDatabaseSync = (
  currentTableIndexRef: React.RefObject<number>,
  setUpdateProgress: React.Dispatch<React.SetStateAction<IUpdateProgress>>,
  setIsInitializing: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const { showToast } = useToast();
  const {
    status,
    updateCurrentTable,
    updateCurrentPage,
    tablesToUpdate,
    setStatus,
    setUpdateCurrentTable,
    setUpdateCurrentPage,
    setTotalPages,
    setOverallProgress,
  } = useAppInitStore();

  const expectedTotalCountRef = useRef<number>(0);

  useEffect(() => {
    const shouldSkipSync =
      status !== 'RUNNING' ||
      !updateCurrentTable ||
      tablesToUpdate.length === 0;

    if (shouldSkipSync) {
      return;
    }

    let isCancelled = false;

    // 데이터 삽입 완료 후 누락된 데이터가 없는지 검증
    const verifyDataIntegrity = async () => {
      const actualCount =
        await databaseUpdateService.getTableRowCount(updateCurrentTable);

      const expectedCount = expectedTotalCountRef.current;

      if (actualCount !== expectedCount) {
        throw new Error(
          `[VERIFICATION_FAILED] ${updateCurrentTable} 테이블 데이터 유실. (기대값: ${expectedCount}, 실제값: ${actualCount})`,
        );
      }
    };

    // 테이블 업데이트가 성공적으로 완료되면 버전 정보를 저장
    const finalizeTableUpdate = async () => {
      const currentUpdateInfo = tablesToUpdate.find(
        (u) => u.table === updateCurrentTable,
      );

      if (currentUpdateInfo) {
        await databaseUpdateService.updateDatabaseVersion(
          updateCurrentTable,
          currentUpdateInfo.schemaVer,
          currentUpdateInfo.dataVer,
        );
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

        // 해당 테이블 첫 페이지부터 다시 시작하도록 상태 롤백
        await databaseUpdateService.initTable(updateCurrentTable);
        setUpdateCurrentPage(1);
        return;
      }

      logger.error(`Error during insert data: ${(e as Error).stack || e}`);

      setStatus('ERROR');
      showToast({
        message: '데이터 동기화에 실패했습니다. 앱을 재시작해 주세요.',
      });
    };

    // 현재 테이블 작업을 마치고 다음 테이블로 이동 (전체 완료 시 앱 진입 허용)
    const moveToNextTable = async () => {
      currentTableIndexRef.current += 1;

      await AsyncStorage.removeItem('pausedTable');
      await AsyncStorage.removeItem('pausedPage');

      if (currentTableIndexRef.current >= tablesToUpdate.length) {
        setStatus('COMPLETED');
        setUpdateProgress((prev) => ({
          status: '완료',
          progress: 1,
          isUpdating: prev.isUpdating,
        }));

        setTimeout(() => {
          setIsInitializing(false);
        }, 500);
        return;
      }

      setUpdateCurrentTable(
        tablesToUpdate[currentTableIndexRef.current].table as any,
      );
      setUpdateCurrentPage(1);
    };

    // 페이지 단위로 데이터를 조회하여 삽입하는 메인 루프 처리
    const processNext = async () => {
      try {
        if (updateCurrentPage === 1) {
          setUpdateProgress({
            status: `${TABLE_NAME_MAP[updateCurrentTable]} 데이터 동기화 진행중`,
            progress: currentTableIndexRef.current / tablesToUpdate.length,
            isUpdating: true,
          });

          const initResult =
            await databaseUpdateService.initTable(updateCurrentTable);

          if (initResult !== 'OK') {
            throw new Error(`Failed init table ${updateCurrentTable}`);
          }
        }

        // 데이터 삽입 (페이지 단위)
        const insertResult = await databaseUpdateService.insertData(
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
          tablesToUpdate.length;

        setOverallProgress(newOverallProgress);

        setUpdateProgress({
          status: `${TABLE_NAME_MAP[updateCurrentTable]} 데이터 동기화 중`,
          progress: newOverallProgress,
          isUpdating: true,
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
    tablesToUpdate,
    setStatus,
    setTotalPages,
    setOverallProgress,
    setUpdateCurrentTable,
    setUpdateCurrentPage,
    setUpdateProgress,
    setIsInitializing,
    currentTableIndexRef,
    showToast,
  ]);
};
