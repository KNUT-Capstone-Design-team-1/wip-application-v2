import { databaseUpdateService } from './database_update_service';
import { databaseDownloadService } from './database_download_service';
import logger from '@utils/logger';
import { TABLE_NAME_MAP, TDataTable } from '@services/database/types';
import {
  IUpdateNeeded,
  ITableMetadata,
  ISyncPipelineCallbacks,
} from '../types';

// 1단계: REST API로부터 페이지 데이터를 백그라운드 세션으로 수신 및 로컬 캐싱
export const executeFetchPhase = async (
  tablesToUpdate: IUpdateNeeded[],
  currentTableIndexRef: React.RefObject<number>,
  isCancelled: () => boolean,
  callbacks: ISyncPipelineCallbacks,
): Promise<Map<string, ITableMetadata>> => {
  const totalTables: number = tablesToUpdate.length;
  const tableMetadataMap = new Map<string, ITableMetadata>();

  for (let tIdx = 0; tIdx < totalTables; tIdx++) {
    const isTaskCancelled: boolean = isCancelled();
    if (isTaskCancelled) break;

    currentTableIndexRef.current = tIdx;
    const updateInfo = tablesToUpdate[tIdx];
    const table = updateInfo.table as TDataTable;
    const tableNameKr: string = TABLE_NAME_MAP[table] || table;

    callbacks.setUpdateCurrentTable(table);

    // 1페이지 데이터 수신 (전체 페이지 수 및 아이템 수 확인)
    const firstPageData = await databaseDownloadService.fetchAndCachePageData(
      table,
      1,
    );
    const totalPages: number = firstPageData.totalPage || 1;
    const totalItems: number = firstPageData.total || 0;
    tableMetadataMap.set(table, { totalPages, totalItems });
    callbacks.setTotalPages(totalPages);

    const initialProgress: number = (tIdx + 1 / totalPages) / totalTables;
    callbacks.setOverallProgress(initialProgress);
    callbacks.setUpdateProgress({
      status: `${tableNameKr} 데이터 수신 중 (${Math.round((1 / totalPages) * 100)}%)`,
      progress: initialProgress,
      isUpdating: true,
    });

    await databaseDownloadService.saveUpdateState({
      status: 'downloading',
      tablesToUpdate,
      currentTableIndex: tIdx,
      currentTable: table,
      currentPage: 1,
      totalPages,
      overallProgress: initialProgress,
      completedTables: [],
      lastUpdated: Date.now(),
    });

    // 2페이지부터 나머지 페이지들 데이터 수신
    for (let page = 2; page <= totalPages; page++) {
      if (isCancelled()) break;

      callbacks.setUpdateCurrentPage(page);
      await databaseDownloadService.fetchAndCachePageData(table, page);

      const tableProgress: number = page / totalPages;
      const currentOverall: number = (tIdx + tableProgress) / totalTables;

      callbacks.setOverallProgress(currentOverall);
      callbacks.setUpdateProgress({
        status: `${tableNameKr} 데이터 수신 중 (${Math.round(tableProgress * 100)}%)`,
        progress: currentOverall,
        isUpdating: true,
      });

      await databaseDownloadService.saveUpdateState({
        status: 'downloading',
        tablesToUpdate,
        currentTableIndex: tIdx,
        currentTable: table,
        currentPage: page,
        totalPages,
        overallProgress: currentOverall,
        completedTables: [],
        lastUpdated: Date.now(),
      });
    }
  }

  return tableMetadataMap;
};

// 2단계: 수신된 모든 페이지 데이터의 유효성 검증
export const executeValidationPhase = async (
  tablesToUpdate: IUpdateNeeded[],
  tableMetadataMap: Map<string, ITableMetadata>,
  callbacks: ISyncPipelineCallbacks,
): Promise<void> => {
  callbacks.setUpdateProgress({
    status: '데이터 수신 완료, 검증 중...',
    progress: 1.0,
    isUpdating: true,
  });

  for (const updateInfo of tablesToUpdate) {
    const table = updateInfo.table as TDataTable;
    const meta = tableMetadataMap.get(table);
    const hasMetadata: boolean = Boolean(meta);

    if (!hasMetadata) {
      throw new Error(`Missing metadata for table ${table}`);
    }

    const isAllCached: boolean =
      await databaseDownloadService.verifyAllTablePagesCached(
        table,
        meta!.totalPages,
      );

    if (!isAllCached) {
      throw new Error(`Incomplete cached data files for table ${table}`);
    }
  }
};

// 3단계: 로컬 SQLite 데이터베이스에 캐시된 데이터 일괄 반영 (포그라운드)
export const executeDatabaseApplyPhase = async (
  tablesToUpdate: IUpdateNeeded[],
  tableMetadataMap: Map<string, ITableMetadata>,
  isCancelled: () => boolean,
  callbacks: ISyncPipelineCallbacks,
): Promise<void> => {
  const totalTables: number = tablesToUpdate.length;

  for (let tIdx = 0; tIdx < totalTables; tIdx++) {
    const isTaskCancelled: boolean = isCancelled();
    if (isTaskCancelled) break;

    const updateInfo = tablesToUpdate[tIdx];
    const table = updateInfo.table as TDataTable;
    const tableNameKr: string = TABLE_NAME_MAP[table] || table;
    const meta = tableMetadataMap.get(table)!;

    callbacks.setUpdateProgress({
      status: `${tableNameKr} 데이터베이스 적용 중...`,
      progress: (tIdx + 0.5) / totalTables,
      isUpdating: true,
    });

    // 캐시된 JSON 파일들로부터 데이터 일괄 삽입 및 무결성 검증
    await databaseUpdateService.applyCachedDataToTable(
      table,
      meta.totalPages,
      meta.totalItems,
    );

    // 버전 정보 업데이트
    await databaseUpdateService.updateDatabaseVersion(
      table,
      updateInfo.schemaVer,
      updateInfo.dataVer,
    );

    logger.info(`[SYNC] Completed DB apply for ${table}`);
  }
};

// 4단계: 완료 및 임시 캐시 파일 정리
export const executeCleanupPhase = async (): Promise<void> => {
  await databaseDownloadService.cleanTempCache();
  await databaseDownloadService.clearUpdateState();
};

// 전체 데이터베이스 동기화 파이프라인 오케스트레이터
export const databaseSyncOrchestrator = {
  async runPipeline(
    tablesToUpdate: IUpdateNeeded[],
    currentTableIndexRef: React.RefObject<number>,
    isCancelled: () => boolean,
    callbacks: ISyncPipelineCallbacks,
  ): Promise<void> {
    try {
      // 1단계: API 데이터 백그라운드 수신 및 캐싱
      callbacks.setUpdateStatus('downloading');
      const tableMetadataMap = await executeFetchPhase(
        tablesToUpdate,
        currentTableIndexRef,
        isCancelled,
        callbacks,
      );

      if (isCancelled()) return;

      // 2단계: 데이터 유효성 검증
      callbacks.setUpdateStatus('download_completed');
      await executeValidationPhase(tablesToUpdate, tableMetadataMap, callbacks);

      if (isCancelled()) return;

      // 3단계: SQLite 데이터베이스 반영
      callbacks.setUpdateStatus('installing');
      await executeDatabaseApplyPhase(
        tablesToUpdate,
        tableMetadataMap,
        isCancelled,
        callbacks,
      );

      if (isCancelled()) return;

      // 4단계: 캐시 정리 및 완료 처리
      await executeCleanupPhase();

      callbacks.setUpdateStatus('completed');
      callbacks.setStatus('COMPLETED');
      callbacks.setOverallProgress(1.0);
      callbacks.setUpdateProgress({
        status: '업데이트 완료',
        progress: 1.0,
        isUpdating: true,
      });

      setTimeout(() => {
        callbacks.setIsInitializing(false);
      }, 500);
    } catch (err) {
      logger.error(
        `[SYNC-ERROR] Database update failed: ${(err as Error).stack || err}`,
      );

      callbacks.setUpdateStatus('failed');
      callbacks.setStatus('ERROR');
      callbacks.setErrorMessage((err as Error).message || '데이터 동기화 실패');

      callbacks.setUpdateProgress({
        status: '업데이트 실패',
        progress: 0,
        isUpdating: false,
      });

      callbacks.showToast({
        message:
          '데이터베이스 업데이트 중 문제가 발생했습니다. 앱을 다시 실행해 주세요.',
      });
    }
  },
};
