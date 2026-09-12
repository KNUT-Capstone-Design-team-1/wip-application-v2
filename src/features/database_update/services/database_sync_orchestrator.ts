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
import { PIPELINE_RETRY_CONFIG } from '../constants';

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

// 파이프라인 단계 순차 실행
const executePipelinePhases = async (
  tablesToUpdate: IUpdateNeeded[],
  currentTableIndexRef: React.RefObject<number>,
  isCancelled: () => boolean,
  callbacks: ISyncPipelineCallbacks,
): Promise<boolean> => {
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
  if (isCancelled()) {
    return false;
  }

  // 2단계: 데이터 유효성 검증
  callbacks.setUpdateStatus('download_completed');
  await executeValidationPhase(tablesToUpdate, tableMetadataMap, callbacks);
  if (isCancelled()) {
    return false;
  }

  // 3단계: SQLite 데이터베이스 반영
  callbacks.setUpdateStatus('installing');
  await executeDatabaseApplyPhase(
    tablesToUpdate,
    tableMetadataMap,
    isCancelled,
    callbacks,
  );
  if (isCancelled()) {
    return false;
  }

  // 4단계: 캐시 정리 및 완료 처리
  await executeCleanupPhase();
  handlePipelineSuccess(callbacks);
  return true;
};

// 재시도 전 임시 데이터 및 상태 초기화
const prepareForRetry = async (
  err: unknown,
  currentTableIndexRef: React.RefObject<number>,
  callbacks: ISyncPipelineCallbacks,
): Promise<void> => {
  handlePipelineFailure(err, callbacks);
  await executeCleanupPhase();

  if (currentTableIndexRef) {
    currentTableIndexRef.current = 0;
  }
  resetFetchProgress(0);
};

// 재시도 전 대기하며 취소 여부 확인
const waitWithCancellationCheck = async (
  durationMs: number,
  isCancelled: () => boolean,
): Promise<boolean> => {
  const iterations = Math.ceil(
    durationMs / PIPELINE_RETRY_CONFIG.RETRY_INTERVAL_MS,
  );

  for (let i = 0; i < iterations; i++) {
    if (isCancelled()) {
      return false;
    }
    await new Promise((resolve) =>
      setTimeout(resolve, PIPELINE_RETRY_CONFIG.RETRY_INTERVAL_MS),
    );
  }

  return !isCancelled();
};

// 전체 데이터베이스 동기화 파이프라인 오케스트레이터
export const databaseSyncOrchestrator = {
  async runPipeline(
    tablesToUpdate: IUpdateNeeded[],
    currentTableIndexRef: React.RefObject<number>,
    isCancelled: () => boolean,
    callbacks: ISyncPipelineCallbacks,
  ): Promise<void> {
    while (!isCancelled()) {
      try {
        const isSuccess = await executePipelinePhases(
          tablesToUpdate,
          currentTableIndexRef,
          isCancelled,
          callbacks,
        );

        if (isSuccess || isCancelled()) {
          return;
        }
      } catch (err) {
        if (isCancelled()) {
          return;
        }

        await prepareForRetry(err, currentTableIndexRef, callbacks);

        const shouldContinue = await waitWithCancellationCheck(
          PIPELINE_RETRY_CONFIG.RETRY_DELAY_MS,
          isCancelled,
        );
        if (!shouldContinue) {
          return;
        }
      }
    }
  },
};
