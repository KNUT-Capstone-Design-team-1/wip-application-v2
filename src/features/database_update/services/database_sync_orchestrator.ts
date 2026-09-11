import { databaseUpdateService } from './database_update_service';
import { databaseDownloadService } from './database_download_service';
import logger from '@utils/logger';
import { TDataTable } from '@services/database/types';
import {
  IUpdateNeeded,
  ITableMetadata,
  ISyncPipelineCallbacks,
} from '../types';
import { SYNC_PHASE_STATUS } from '../constants';

let highestProgress: number = 0;

// 단일 테이블의 전체 페이지(1페이지부터 마지막 페이지까지)를 수신하고 진행률을 갱신
export const fetchAndPersistTable = async (
  table: TDataTable,
  tIdx: number,
  totalTables: number,
  tablesToUpdate: IUpdateNeeded[],
  isCancelled: () => boolean,
  callbacks: ISyncPipelineCallbacks,
): Promise<ITableMetadata> => {
  callbacks.setUpdateCurrentTable(table);

  // 1. 1페이지 수신 (메타데이터 확보)
  const firstPageData = await databaseDownloadService.fetchAndCachePageData(
    table,
    1,
  );
  const totalPages: number = firstPageData.totalPage || 1;
  const totalItems: number = firstPageData.total || 0;
  callbacks.setTotalPages(totalPages);
  callbacks.setUpdateCurrentPage(1);

  const initialProgress: number = (tIdx + 1 / totalPages) / totalTables;
  highestProgress = Math.max(highestProgress, initialProgress);
  callbacks.setOverallProgress(highestProgress);
  callbacks.setUpdateProgress({
    status: SYNC_PHASE_STATUS.DOWNLOADING,
    progress: highestProgress,
    isUpdating: true,
  });

  databaseDownloadService.saveUpdateState({
    status: 'downloading',
    tablesToUpdate,
    currentTableIndex: tIdx,
    currentTable: table,
    currentPage: 1,
    totalPages,
    overallProgress: highestProgress,
    completedTables: [],
    lastUpdated: Date.now(),
  });

  // 2. 2페이지 이상이 있는 경우 병렬 다운로드 진행
  if (totalPages > 1 && !isCancelled()) {
    let completedCount: number = 1;

    await databaseDownloadService.fetchAndCacheTablePagesInParallel(
      table,
      totalPages,
      2,
      (page: number) => {
        if (isCancelled()) return;

        completedCount++;
        callbacks.setUpdateCurrentPage(page);

        const tableProgress: number = completedCount / totalPages;
        const targetOverall: number = (tIdx + tableProgress) / totalTables;

        highestProgress = Math.max(highestProgress, targetOverall);
        callbacks.setOverallProgress(highestProgress);
        callbacks.setUpdateProgress({
          status: SYNC_PHASE_STATUS.DOWNLOADING,
          progress: highestProgress,
          isUpdating: true,
        });

        databaseDownloadService.saveUpdateState({
          status: 'downloading',
          tablesToUpdate,
          currentTableIndex: tIdx,
          currentTable: table,
          currentPage: page,
          totalPages,
          overallProgress: highestProgress,
          completedTables: [],
          lastUpdated: Date.now(),
        });
      },
    );
  }

  return { totalPages, totalItems };
};

// 1단계: REST API로부터 모든 대상 테이블을 순차적으로 완전 수신
export const executeFetchPhase = async (
  tablesToUpdate: IUpdateNeeded[],
  currentTableIndexRef: React.RefObject<number>,
  isCancelled: () => boolean,
  callbacks: ISyncPipelineCallbacks,
): Promise<Map<string, ITableMetadata>> => {
  const totalTables: number = tablesToUpdate.length;
  const tableMetadataMap = new Map<string, ITableMetadata>();

  for (let tIdx = 0; tIdx < totalTables; tIdx++) {
    if (isCancelled()) break;

    currentTableIndexRef.current = tIdx;
    const updateInfo = tablesToUpdate[tIdx];
    const table = updateInfo.table as TDataTable;

    const meta = await fetchAndPersistTable(
      table,
      tIdx,
      totalTables,
      tablesToUpdate,
      isCancelled,
      callbacks,
    );
    tableMetadataMap.set(table, meta);
  }

  return tableMetadataMap;
};

// 단일 테이블의 캐시 파일 무결성 검증
export const validateSingleTableCache = async (
  updateInfo: IUpdateNeeded,
  tableMetadataMap: Map<string, ITableMetadata>,
): Promise<void> => {
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
};

// 2단계: 수신된 모든 페이지 데이터의 유효성 검증
export const executeValidationPhase = async (
  tablesToUpdate: IUpdateNeeded[],
  tableMetadataMap: Map<string, ITableMetadata>,
  callbacks: ISyncPipelineCallbacks,
): Promise<void> => {
  callbacks.setUpdateProgress({
    status: SYNC_PHASE_STATUS.VALIDATING,
    progress: 1.0,
    isUpdating: true,
  });

  for (const updateInfo of tablesToUpdate) {
    await validateSingleTableCache(updateInfo, tableMetadataMap);
  }
};

// 단일 테이블에 대한 SQLite DB 배치 반영 및 버전 갱신
export const applySingleTableToDatabase = async (
  updateInfo: IUpdateNeeded,
  tableMetadataMap: Map<string, ITableMetadata>,
  tIdx: number,
  totalTables: number,
  callbacks: ISyncPipelineCallbacks,
): Promise<void> => {
  const table = updateInfo.table as TDataTable;
  const meta = tableMetadataMap.get(table)!;

  callbacks.setUpdateProgress({
    status: SYNC_PHASE_STATUS.APPLYING,
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
    await applySingleTableToDatabase(
      updateInfo,
      tableMetadataMap,
      tIdx,
      totalTables,
      callbacks,
    );
  }
};

// 4단계: 완료 및 임시 캐시 파일 정리
export const executeCleanupPhase = async (): Promise<void> => {
  await databaseDownloadService.cleanTempCache();
  await databaseDownloadService.clearUpdateState();
};

// 파이프라인 정상 완료 시 UI 상태 및 스토어 업데이트
export const handlePipelineSuccess = (
  callbacks: ISyncPipelineCallbacks,
): void => {
  callbacks.setUpdateStatus('completed');
  callbacks.setStatus('COMPLETED');
  callbacks.setOverallProgress(1.0);
  callbacks.setUpdateProgress({
    status: SYNC_PHASE_STATUS.COMPLETED,
    progress: 1.0,
    isUpdating: true,
  });

  setTimeout(() => {
    callbacks.setIsInitializing(false);
  }, 500);
};

// 파이프라인 실패 시 에러 로깅 및 UI 롤백 처리
export const handlePipelineFailure = (
  err: unknown,
  callbacks: ISyncPipelineCallbacks,
): void => {
  logger.error(
    `[SYNC-ERROR] Database update failed: ${(err as Error).stack || err}`,
  );

  callbacks.setUpdateStatus('failed');
  callbacks.setStatus('ERROR');
  callbacks.setErrorMessage((err as Error).message || SYNC_PHASE_STATUS.FAILED);

  callbacks.setUpdateProgress({
    status: SYNC_PHASE_STATUS.FAILED,
    progress: 0,
    isUpdating: false,
  });

  callbacks.showToast({
    message:
      '데이터베이스 업데이트 중 문제가 발생했습니다. 앱을 다시 실행해 주세요.',
  });
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
      const persistedState = await databaseDownloadService.loadUpdateState();
      const hasPersistedProgress: boolean =
        typeof persistedState?.overallProgress === 'number';
      highestProgress = hasPersistedProgress
        ? persistedState!.overallProgress
        : 0;

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
      handlePipelineSuccess(callbacks);
    } catch (err) {
      handlePipelineFailure(err, callbacks);
    }
  },
};
