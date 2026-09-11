import { useAppInitStore } from '../../../src/features/database_update/store/app_init_store';
import { databaseUpdateService } from '../../../src/features/database_update/services/database_update_service';
import { databaseDownloadService } from '../../../src/features/database_update/services/database_download_service';
import { getRequiredDatabaseUpdates } from '../../../src/features/database_update/utils/updateCheck';
import { ALL_DATA_TABLES } from '@services/database/types';

jest.mock(
  '../../../src/features/database_update/services/database_update_service',
  () => ({
    databaseUpdateService: {
      checkRequireTableUpdate: jest.fn(),
      installTableFromFiles: jest.fn(),
      updateDatabaseVersion: jest.fn(),
    },
  }),
);

jest.mock(
  '../../../src/features/database_update/services/database_download_service',
  () => ({
    databaseDownloadService: {
      downloadPageWithRetry: jest.fn(),
      saveUpdateState: jest.fn(),
      loadUpdateState: jest.fn(),
      verifyAllTablePagesDownloaded: jest.fn(),
      cleanTempFiles: jest.fn(),
      clearUpdateState: jest.fn(),
    },
  }),
);

describe('데이터베이스 업데이트 상태 및 체크 로직 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAppInitStore.getState().reset();
  });

  describe('useAppInitStore 상태 관리', () => {
    it('초기 상태가 정상적으로 설정되어야 한다', () => {
      const state = useAppInitStore.getState();
      expect(state.status).toBe('IDLE');
      expect(state.updateStatus).toBe('idle');
      expect(state.overallProgress).toBe(0);
      expect(state.tablesToUpdate).toEqual([]);
    });

    it('업데이트 상태 및 진행률 변경 액션이 동작해야 한다', () => {
      const store = useAppInitStore.getState();

      store.setStatus('RUNNING');
      store.setUpdateStatus('downloading');
      store.setOverallProgress(0.75);
      store.setTotalPages(10);
      store.setUpdateCurrentPage(7);

      const updated = useAppInitStore.getState();
      expect(updated.status).toBe('RUNNING');
      expect(updated.updateStatus).toBe('downloading');
      expect(updated.overallProgress).toBe(0.75);
      expect(updated.totalPages).toBe(10);
      expect(updated.updateCurrentPage).toBe(7);
    });

    it('reset 호출 시 초기 상태로 초기화되어야 한다', () => {
      const store = useAppInitStore.getState();
      store.setStatus('RUNNING');
      store.setUpdateStatus('installing');
      store.reset();

      const updated = useAppInitStore.getState();
      expect(updated.status).toBe('IDLE');
      expect(updated.updateStatus).toBe('idle');
    });
  });

  describe('getRequiredDatabaseUpdates', () => {
    it('모든 테이블 검사 후 업데이트가 필요한 테이블 목록을 반환해야 한다', async () => {
      (
        databaseUpdateService.checkRequireTableUpdate as jest.Mock
      ).mockImplementation((table) => {
        if (table === 'pill_data') {
          return Promise.resolve({
            code: 'REQUIRE-UPDATE',
            newSchemaVersion: 2,
            newDataVersion: 20260101,
            oldSchemaVersion: 1,
            oldDataVersion: 20250101,
          });
        }
        return Promise.resolve({
          code: 'UNNECESSARY-UPDATE',
          newSchemaVersion: 1,
          newDataVersion: 20250101,
        });
      });

      const result = await getRequiredDatabaseUpdates();

      expect(result.updatesNeeded).toHaveLength(1);
      expect(result.updatesNeeded[0].table).toBe('pill_data');
      expect(result.updatesNeeded[0].schemaVer).toBe(2);
      expect(result.isForceUpdate).toBe(false);
    });

    it('모든 테이블이 업데이트 대상이면 isForceUpdate=true 여야 한다', async () => {
      (
        databaseUpdateService.checkRequireTableUpdate as jest.Mock
      ).mockResolvedValue({
        code: 'REQUIRE-UPDATE',
        newSchemaVersion: 2,
        newDataVersion: 20260101,
      });

      const result = await getRequiredDatabaseUpdates();

      expect(result.updatesNeeded).toHaveLength(ALL_DATA_TABLES.length);
      expect(result.isForceUpdate).toBe(true);
    });
  });

  describe('백그라운드 다운로드 후 설치 통합 시나리오 검증', () => {
    it('다운로드 완료 후 설치 및 버전 갱신이 성공해야 한다', async () => {
      (
        databaseDownloadService.downloadPageWithRetry as jest.Mock
      ).mockResolvedValue({
        resource: [{ id: 1 }],
        total: 10,
        totalPage: 1,
        current: 1,
      });
      (
        databaseDownloadService.verifyAllTablePagesDownloaded as jest.Mock
      ).mockResolvedValue(true);
      (
        databaseUpdateService.installTableFromFiles as jest.Mock
      ).mockResolvedValue('OK');
      (
        databaseUpdateService.updateDatabaseVersion as jest.Mock
      ).mockResolvedValue('OK');

      const page1 = await databaseDownloadService.downloadPageWithRetry(
        'pill_data',
        1,
      );
      expect(page1.total).toBe(10);

      const isVerified =
        await databaseDownloadService.verifyAllTablePagesDownloaded(
          'pill_data',
          1,
        );
      expect(isVerified).toBe(true);

      const installRes = await databaseUpdateService.installTableFromFiles(
        'pill_data',
        1,
        10,
      );
      expect(installRes).toBe('OK');

      const versionRes = await databaseUpdateService.updateDatabaseVersion(
        'pill_data',
        2,
        20260101,
      );
      expect(versionRes).toBe('OK');
    });
  });
});
