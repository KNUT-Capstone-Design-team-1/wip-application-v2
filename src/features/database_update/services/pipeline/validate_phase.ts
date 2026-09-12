import { TDataTable } from '@services/database/types';
import { databaseDownloadService } from '../database_download_service';
import {
  IUpdateNeeded,
  ITableMetadata,
  ISyncPipelineCallbacks,
} from '../../types';
import { SYNC_PHASE_STATUS } from '../../constants';

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
