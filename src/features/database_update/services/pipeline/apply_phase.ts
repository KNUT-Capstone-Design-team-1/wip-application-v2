import { TDataTable } from '@services/database/types';
import logger from '@utils/logger';
import { databaseUpdateService } from '../database_update_service';
import {
  IUpdateNeeded,
  ITableMetadata,
  ISyncPipelineCallbacks,
} from '../../types';
import { SYNC_PHASE_STATUS } from '../../constants';

// 단일 테이블에 대한 SQLite DB 배치 반영 및 버전 갱신
export const applySingleTableToDatabase = async (
  updateInfo: IUpdateNeeded,
  tableMetadataMap: Map<string, ITableMetadata>,
  _tIdx: number,
  _totalTables: number,
  callbacks: ISyncPipelineCallbacks,
): Promise<void> => {
  const table = updateInfo.table as TDataTable;
  const meta = tableMetadataMap.get(table)!;

  callbacks.setUpdateProgress({
    status: SYNC_PHASE_STATUS.APPLYING,
    progress: 1.0,
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

// 3단계: 로컬 SQLite 데이터베이스에 캐시된 데이터 일괄 반영
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
