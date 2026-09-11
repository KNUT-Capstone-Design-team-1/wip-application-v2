import { databaseBootstrapService } from '../../../src/features/database_update/services/database_bootstrap_service';
import { databaseDownloadService } from '../../../src/features/database_update/services/database_download_service';
import { getRequiredDatabaseUpdates } from '../../../src/features/database_update/utils/updateCheck';
import { AppConfigService } from '@services/index';
import { initDatabase } from '@services/database';
import { useAppInitStore } from '../../../src/features/database_update/store/app_init_store';

jest.mock(
  '../../../src/features/database_update/services/database_download_service',
  () => ({
    databaseDownloadService: {
      loadUpdateState: jest.fn(),
    },
  }),
);

jest.mock('../../../src/features/database_update/utils/updateCheck', () => ({
  getRequiredDatabaseUpdates: jest.fn(),
}));

jest.mock('@services/index', () => ({
  AppConfigService: {
    loadExternalConfig: jest.fn(),
  },
}));

jest.mock('@services/database', () => ({
  initDatabase: jest.fn(),
}));

jest.mock('@utils/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('databaseBootstrapService 단위 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAppInitStore.getState().reset();
  });

  describe('executeInitialSetup', () => {
    it('외부 설정 로드 및 데이터베이스 초기화를 순차적으로 실행해야 한다', async () => {
      const setUpdateProgress = jest.fn();

      await databaseBootstrapService.executeInitialSetup(setUpdateProgress);

      expect(AppConfigService.loadExternalConfig).toHaveBeenCalled();
      expect(initDatabase).toHaveBeenCalled();
      expect(setUpdateProgress).toHaveBeenCalledWith(
        expect.objectContaining({ status: '서버 연결 중' }),
      );
      expect(setUpdateProgress).toHaveBeenCalledWith(
        expect.objectContaining({ status: '데이터 동기화 준비 중' }),
      );
    });
  });

  describe('checkAndPromptUpdates', () => {
    it('중단된 영속 업데이트 상태가 있으면 해당 목록을 반환해야 한다', async () => {
      (databaseDownloadService.loadUpdateState as jest.Mock).mockResolvedValue({
        status: 'downloading',
        tablesToUpdate: [
          { table: 'pill_data', schemaVer: 2, dataVer: 20260101 },
        ],
      });

      const setUpdateProgress = jest.fn();
      const result =
        await databaseBootstrapService.checkAndPromptUpdates(setUpdateProgress);

      expect(result).toHaveLength(1);
      expect(result![0].table).toBe('pill_data');
    });

    it('업데이트 대상이 없으면 null을 반환해야 한다', async () => {
      (databaseDownloadService.loadUpdateState as jest.Mock).mockResolvedValue(
        null,
      );
      (getRequiredDatabaseUpdates as jest.Mock).mockResolvedValue({
        updatesNeeded: [],
        isForceUpdate: false,
      });

      const setUpdateProgress = jest.fn();
      const result =
        await databaseBootstrapService.checkAndPromptUpdates(setUpdateProgress);

      expect(result).toBeNull();
    });

    it('강제 업데이트일 경우 사용자 확인 없이 목록을 반환해야 한다', async () => {
      (databaseDownloadService.loadUpdateState as jest.Mock).mockResolvedValue(
        null,
      );
      (getRequiredDatabaseUpdates as jest.Mock).mockResolvedValue({
        updatesNeeded: [{ table: 'cannabis', schemaVer: 1, dataVer: 20260101 }],
        isForceUpdate: true,
      });

      const setUpdateProgress = jest.fn();
      const result =
        await databaseBootstrapService.checkAndPromptUpdates(setUpdateProgress);

      expect(result).toHaveLength(1);
      expect(result![0].table).toBe('cannabis');
    });
  });
});
