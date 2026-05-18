import { initDatabase } from '@services/database';
import logger from '@utils/logger';
import {
  TDataTable,
  ALL_DATA_TABLES,
  TABLE_NAME_MAP,
} from '@services/database/types';
import { DatabaseUpdateService, AppConfigService } from '@services/index';
import { useEffect, useState } from 'react';
import { IUpdateProgress } from '../types';

const DATABASE_INIT_STATUS = {
  COMPLETE: '완료',
} as const;

/**
 * 앱 초기화 로직 담당 커스텀 훅 (외부 설정 로드 및 데이터베이스 초기화/업데이트 관리)
 * @returns 초기화 진행 상세 상태
 */
export const useAppInitializer = () => {
  const [isInitializing, setIsInitializing] = useState(true);

  const [updateProgress, setUpdateProgress] = useState<IUpdateProgress>({
    status: 'DB 초기화 중',
    progress: 0,
  });

  /**
   * 데이터베이스 및 앱 설정 초기화 프로세스 실행
   */
  const initializeDataBase = async () => {
    try {
      setUpdateProgress({ status: '외부 설정 정보 로드 중', progress: 0 });

      await AppConfigService.loadExternalConfig();

      setUpdateProgress({ status: 'DB 초기화 중', progress: 0.05 });

      const initDatabaseSuccess = await initDatabase();
      if (!initDatabaseSuccess) {
        throw new Error('Database initialization failed');
      }

      await updateAllDataTables();

      setUpdateProgress({ status: DATABASE_INIT_STATUS.COMPLETE, progress: 1 });

      setTimeout(() => {
        setIsInitializing(false);
      }, 500);
    } catch (e) {
      logger.error(`Failed to init Database. ${e.stack || e}`);

      setUpdateProgress({ status: '데이터베이스 초기화 실패', progress: 0 });

      setIsInitializing(false);
    }
  };

  /**
   * 정의된 모든 데이터 테이블 업데이트 필요 여부 체크 및 수행
   */
  const updateAllDataTables = async () => {
    for (let i = 0; i < ALL_DATA_TABLES.length; i += 1) {
      const table = ALL_DATA_TABLES[i];

      await dataTableUpdate(table, i + 1, ALL_DATA_TABLES.length);
    }

    console.log(
      'Complete update all data tables. %s',
      ALL_DATA_TABLES.join(', '),
    );
  };

  /**
   * 개별 데이터 테이블 업데이트 필요 여부 체크
   */
  const checkRequireTableUpdate = async (table: TDataTable) => {
    console.log('Updating %s table', table);

    const updateCheck =
      await DatabaseUpdateService.checkRequireTableUpdate(table);

    if (updateCheck.code !== 'REQUIRE-UPDATE') {
      console.log('No update required for %s', table);
      return null;
    }

    return updateCheck;
  };

  /**
   * 데이터 테이블 초기화 및 진행상태 업데이트
   */
  const initTableUpdate = async (
    table: TDataTable,
    currentTableIndex: number,
    totalTables: number,
  ) => {
    setUpdateProgress({
      status: `${TABLE_NAME_MAP[table]} 테이블 초기화 중`,
      progress: (currentTableIndex - 1) / totalTables,
    });

    const result = await DatabaseUpdateService.initTable(table);

    if (result !== 'OK') {
      console.log('Failed init table: %s', table);
      return false;
    }

    return true;
  };

  /**
   * 데이터 삽입 루프 수행 및 진행상태 업데이트
   */
  const insertTableData = async (
    table: TDataTable,
    currentTableIndex: number,
    totalTables: number,
  ) => {
    let currentPage = 1;
    let totalPage = 1;

    do {
      const insertResult = await DatabaseUpdateService.insertData(
        currentPage,
        table,
      );

      if (insertResult.code !== 'OK') {
        console.log('Failed to insert data into: %s', table);
        break;
      }

      totalPage = insertResult.totalPage;

      const tableUpdateProgress = currentPage / totalPage;

      const overallProgress =
        (currentTableIndex - 1 + tableUpdateProgress) / totalTables;

      setUpdateProgress({
        status: `${TABLE_NAME_MAP[table]} 데이터 다운로드 중`,
        progress: overallProgress,
        currentPage,
        totalPages: totalPage,
      });

      currentPage++;
    } while (currentPage <= totalPage);
  };

  /**
   * 개별 데이터 테이블 업데이트 수행
   */
  const dataTableUpdate = async (
    table: TDataTable,
    currentTableIndex: number,
    totalTables: number,
  ) => {
    const updateCheck = await checkRequireTableUpdate(table);

    if (!updateCheck) {
      return;
    }

    if (!(await initTableUpdate(table, currentTableIndex, totalTables))) {
      return;
    }

    await insertTableData(table, currentTableIndex, totalTables);

    const { newSchemaVersion, newDataVersion } = updateCheck;

    await DatabaseUpdateService.updateDatabaseVersion(
      table,
      newSchemaVersion,
      newDataVersion,
    );

    console.log('Complete update table: %s', table);
  };

  useEffect(() => {
    initializeDataBase();
  }, []);

  return { isInitializing, updateProgress };
};
