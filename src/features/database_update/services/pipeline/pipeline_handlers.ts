import logger from '@utils/logger';
import { databaseDownloadService } from '../database_download_service';
import { ISyncPipelineCallbacks } from '../../types';
import { SYNC_PHASE_STATUS } from '../../constants';

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
      '데이터베이스 업데이트 중 문제가 발생했습니다. 기존 데이터로 앱을 실행합니다.',
  });

  setTimeout(() => {
    callbacks.setIsInitializing(false);
  }, 1500);
};
