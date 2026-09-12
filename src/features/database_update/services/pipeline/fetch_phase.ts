import { TDataTable } from '@services/database/types';
import { databaseDownloadService } from '../database_download_service';
import {
  IUpdateNeeded,
  ITableMetadata,
  ISyncPipelineCallbacks,
} from '../../types';
import { SYNC_PHASE_STATUS } from '../../constants';

let highestProgress: number = 0;

export const resetFetchProgress = (initial = 0): void => {
  highestProgress = initial;
};

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
