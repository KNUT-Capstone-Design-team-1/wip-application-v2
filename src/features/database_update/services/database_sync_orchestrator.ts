import { databaseDownloadService } from './database_download_service';
import { IUpdateNeeded, ISyncPipelineCallbacks } from '../types';
import {
  executeFetchPhase,
  fetchAndPersistTable,
  resetFetchProgress,
} from './pipeline/fetch_phase';
import {
  executeValidationPhase,
  validateSingleTableCache,
} from './pipeline/validate_phase';
import {
  executeDatabaseApplyPhase,
  applySingleTableToDatabase,
} from './pipeline/apply_phase';
import {
  executeCleanupPhase,
  handlePipelineSuccess,
  handlePipelineFailure,
} from './pipeline/pipeline_handlers';

// 하위 호환성을 위해 단계별 개별 함수 export 유지
export {
  executeFetchPhase,
  fetchAndPersistTable,
  executeValidationPhase,
  validateSingleTableCache,
  executeDatabaseApplyPhase,
  applySingleTableToDatabase,
  executeCleanupPhase,
  handlePipelineSuccess,
  handlePipelineFailure,
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
      resetFetchProgress(
        hasPersistedProgress ? persistedState!.overallProgress : 0,
      );

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
