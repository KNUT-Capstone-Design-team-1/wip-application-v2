import { initDatabase } from '@services/database';
import { AppConfigService } from '@services/index';
import logger from '@utils/logger';
import { IUpdateProgress, IUpdateNeeded } from '../types';
import { getRequiredDatabaseUpdates } from '../utils/updateCheck';
import { databaseDownloadService } from './database_download_service';
import { useAppInitStore } from '../store/app_init_store';

// 앱 초기화 및 데이터베이스 동기화 부트스트랩 비즈니스 로직 서비스
export const databaseBootstrapService = {
  // 앱 기동 시 외부 설정 로드 및 로컬 데이터베이스 초기화
  async executeInitialSetup(
    setUpdateProgress: React.Dispatch<React.SetStateAction<IUpdateProgress>>,
  ): Promise<void> {
    setUpdateProgress({
      status: '서버 연결 중',
      progress: 0,
      isUpdating: false,
    });

    await AppConfigService.loadExternalConfig();

    setUpdateProgress({
      status: '데이터 동기화 준비 중',
      progress: 0,
      isUpdating: false,
    });

    await initDatabase();
  },

  // 사용자에게 업데이트 확인 모달 띄우기
  async promptUserForUpdate(updatesNeeded: IUpdateNeeded[]): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      useAppInitStore.getState().setUpdateModal(updatesNeeded, resolve);
    });
  },

  // DB 업데이트 필요 여부 검사
  async checkAndPromptUpdates(
    setUpdateProgress: React.Dispatch<React.SetStateAction<IUpdateProgress>>,
  ): Promise<IUpdateNeeded[] | null> {
    setUpdateProgress({
      status: '업데이트 확인 중',
      progress: 0,
      isUpdating: false,
    });

    const { updatesNeeded, isForceUpdate } = await getRequiredDatabaseUpdates();
    const hasUpdatesNeeded: boolean = updatesNeeded.length > 0;

    if (!hasUpdatesNeeded) {
      await databaseDownloadService.cleanTempCache();
      return null;
    }

    if (isForceUpdate) {
      return updatesNeeded; // 필수 업데이트의 경우 확인 없이 자동 진행
    }

    const isConfirmedByUser: boolean =
      await this.promptUserForUpdate(updatesNeeded);

    if (!isConfirmedByUser) {
      await databaseDownloadService.cleanTempCache();
      await databaseDownloadService.clearUpdateState();
      return null;
    }

    return updatesNeeded;
  },
};
