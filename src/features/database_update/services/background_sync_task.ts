import { backgroundTaskService } from '@services/background';
import { databaseDownloadService } from './database_download_service';
import { databaseUpdateService } from './database_update_service';
import { ALL_DATA_TABLES, TDataTable } from '@services/database/types';
import logger from '@utils/logger';

// 데이터베이스 동기화 백그라운드 핸들러
export const executeDatabaseBackgroundSync = async (): Promise<void> => {
  logger.info(
    '[BACKGROUND-TASK] Executing database background sync handler...',
  );

  // 1. 중단되었던 기존 다운로드 상태가 있는지 확인
  const persistedState = await databaseDownloadService.loadUpdateState();
  const hasPendingState: boolean = Boolean(
    persistedState && persistedState.status === 'downloading',
  );

  if (hasPendingState && persistedState) {
    const tables = persistedState.tablesToUpdate || [];
    const startIndex = persistedState.currentTableIndex || 0;
    const totalTables = tables.length || 1;

    for (let tIdx = startIndex; tIdx < tables.length; tIdx++) {
      const updateInfo = tables[tIdx];
      const table = updateInfo.table as TDataTable;

      const firstPageData = await databaseDownloadService.fetchAndCachePageData(
        table,
        1,
      );
      const totalPages: number = firstPageData.totalPage || 1;
      const hasMultiplePages: boolean = totalPages > 1;

      if (hasMultiplePages) {
        let completedCount: number = 1;
        await databaseDownloadService.fetchAndCacheTablePagesInParallel(
          table,
          totalPages,
          2,
          (page: number) => {
            completedCount++;
            const tableProgress: number = completedCount / totalPages;
            const targetOverall: number = (tIdx + tableProgress) / totalTables;

            databaseDownloadService.saveUpdateState({
              ...persistedState,
              currentTableIndex: tIdx,
              currentTable: table,
              currentPage: page,
              totalPages,
              overallProgress: targetOverall,
              lastUpdated: Date.now(),
            });
          },
        );
      } else {
        const targetOverall: number = (tIdx + 1) / totalTables;
        databaseDownloadService.saveUpdateState({
          ...persistedState,
          currentTableIndex: tIdx,
          currentTable: table,
          currentPage: 1,
          totalPages: 1,
          overallProgress: targetOverall,
          lastUpdated: Date.now(),
        });
      }
    }
    return;
  }

  // 2. 진행 중인 작업이 없다면 새로운 서버 버전 체크
  for (const table of ALL_DATA_TABLES) {
    const checkResult =
      await databaseUpdateService.checkRequireTableUpdate(table);

    const isUpdateRequired: boolean = checkResult.code === 'REQUIRE-UPDATE';

    if (isUpdateRequired) {
      const firstPageData = await databaseDownloadService.fetchAndCachePageData(
        table,
        1,
      );

      const totalPages: number = firstPageData.totalPage || 1;

      if (totalPages > 1) {
        await databaseDownloadService.fetchAndCacheTablePagesInParallel(
          table,
          totalPages,
          2,
        );
      }
    }
  }
};

// 공통 백그라운드 서비스에 DB 동기화 핸들러 등록
backgroundTaskService.registerHandler(executeDatabaseBackgroundSync);
