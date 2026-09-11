import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import logger from '@utils/logger';

export const APP_BACKGROUND_TASK_NAME: string =
  'com.mbm.whatispill.background-sync';

// 등록된 백그라운드 핸들러 목록 관리
const backgroundHandlers: (() => Promise<void>)[] = [];

// 공통 백그라운드 태스크 정의 (앱 전역 최상단에서 단 1회 등록)
TaskManager.defineTask(APP_BACKGROUND_TASK_NAME, async () => {
  logger.info('[BACKGROUND-TASK] App background task running...');
  try {
    for (const handler of backgroundHandlers) {
      await handler();
    }
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (err) {
    logger.error(`[BACKGROUND-TASK] Background execution failed: ${err}`);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export const backgroundTaskService = {
  // 개별 기능(feature)에서 백그라운드 작업 핸들러 등록
  registerHandler(handler: () => Promise<void>): void {
    backgroundHandlers.push(handler);
  },

  // OS 백그라운드 스케줄러에 공통 태스크 등록
  async registerTask(minimumIntervalMinutes = 15): Promise<void> {
    try {
      const isRegistered: boolean = await TaskManager.isTaskRegisteredAsync(
        APP_BACKGROUND_TASK_NAME,
      );
      if (isRegistered) {
        return;
      }

      await BackgroundTask.registerTaskAsync(APP_BACKGROUND_TASK_NAME, {
        minimumInterval: minimumIntervalMinutes,
      });
      logger.info(
        `[BACKGROUND-TASK] Registered global background task with interval ${minimumIntervalMinutes}m`,
      );
    } catch (err) {
      logger.error(
        `[BACKGROUND-TASK] Failed to register global background task: ${err}`,
      );
    }
  },

  // OS 백그라운드 스케줄러에서 공통 태스크 해제
  async unregisterTask(): Promise<void> {
    try {
      const isRegistered: boolean = await TaskManager.isTaskRegisteredAsync(
        APP_BACKGROUND_TASK_NAME,
      );
      if (isRegistered) {
        await BackgroundTask.unregisterTaskAsync(APP_BACKGROUND_TASK_NAME);
        logger.info('[BACKGROUND-TASK] Unregistered global background task');
      }
    } catch (err) {
      logger.error(
        `[BACKGROUND-TASK] Failed to unregister global background task: ${err}`,
      );
    }
  },
};
