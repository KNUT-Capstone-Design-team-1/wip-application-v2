import {
  databaseSyncOrchestrator,
  executeFetchPhase,
  executeValidationPhase,
  executeDatabaseApplyPhase,
  executeCleanupPhase,
} from '../../../src/features/database_update/services/database_sync_orchestrator';
import { databaseDownloadService } from '../../../src/features/database_update/services/database_download_service';
import { databaseUpdateService } from '../../../src/features/database_update/services/database_update_service';

jest.mock(
  '../../../src/features/database_update/services/database_download_service',
  () => ({
    databaseDownloadService: {
      fetchAndCachePageData: jest.fn(),
      fetchAndCacheTablePagesInParallel: jest.fn(
        (table, totalPages, startPage, onPageComplete) => {
          for (let p = startPage; p <= totalPages; p++) {
            onPageComplete?.(p);
          }
          return Promise.resolve();
        },
      ),
      saveUpdateState: jest.fn(),
      verifyAllTablePagesCached: jest.fn(),
      cleanTempCache: jest.fn(),
      clearUpdateState: jest.fn(),
    },
  }),
);

jest.mock(
  '../../../src/features/database_update/services/database_update_service',
  () => ({
    databaseUpdateService: {
      applyCachedDataToTable: jest.fn(),
      updateDatabaseVersion: jest.fn(),
    },
  }),
);

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

describe('databaseSyncOrchestrator 단위 테스트', () => {
  const mockCallbacks = {
    setUpdateProgress: jest.fn(),
    setUpdateCurrentTable: jest.fn(),
    setUpdateCurrentPage: jest.fn(),
    setTotalPages: jest.fn(),
    setOverallProgress: jest.fn(),
    setUpdateStatus: jest.fn(),
    setStatus: jest.fn(),
    setErrorMessage: jest.fn(),
    setIsInitializing: jest.fn(),
    showToast: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('executeFetchPhase', () => {
    it('각 테이블의 페이지들을 순회하며 캐싱하고 진행률을 갱신해야 한다', async () => {
      (
        databaseDownloadService.fetchAndCachePageData as jest.Mock
      ).mockResolvedValue({
        resource: [{ ITEM_SEQ: '1' }],
        total: 10,
        totalPage: 2,
        current: 1,
      });

      const currentTableIndexRef = { current: 0 };
      const tablesToUpdate = [
        { table: 'pill_data', schemaVer: 2, dataVer: 20260101 },
      ];

      const metaMap = await executeFetchPhase(
        tablesToUpdate,
        currentTableIndexRef,
        () => false,
        mockCallbacks,
      );

      expect(
        databaseDownloadService.fetchAndCachePageData,
      ).toHaveBeenCalledWith('pill_data', 1);
      expect(
        databaseDownloadService.fetchAndCacheTablePagesInParallel,
      ).toHaveBeenCalledWith('pill_data', 2, 2, expect.any(Function));
      expect(metaMap.get('pill_data')).toEqual({
        totalPages: 2,
        totalItems: 10,
      });
      expect(mockCallbacks.setOverallProgress).toHaveBeenCalled();
    });
  });

  describe('executeValidationPhase', () => {
    it('모든 페이지 캐시가 유효하면 검증을 성공적으로 통과해야 한다', async () => {
      (
        databaseDownloadService.verifyAllTablePagesCached as jest.Mock
      ).mockResolvedValue(true);

      const tablesToUpdate = [
        { table: 'pill_data', schemaVer: 2, dataVer: 20260101 },
      ];
      const tableMetadataMap = new Map([
        ['pill_data', { totalPages: 2, totalItems: 10 }],
      ]);

      await expect(
        executeValidationPhase(tablesToUpdate, tableMetadataMap, mockCallbacks),
      ).resolves.not.toThrow();

      expect(
        databaseDownloadService.verifyAllTablePagesCached,
      ).toHaveBeenCalledWith('pill_data', 2);
    });

    it('캐시 파일이 불완전하면 에러를 던져야 한다', async () => {
      (
        databaseDownloadService.verifyAllTablePagesCached as jest.Mock
      ).mockResolvedValue(false);

      const tablesToUpdate = [
        { table: 'pill_data', schemaVer: 2, dataVer: 20260101 },
      ];
      const tableMetadataMap = new Map([
        ['pill_data', { totalPages: 2, totalItems: 10 }],
      ]);

      await expect(
        executeValidationPhase(tablesToUpdate, tableMetadataMap, mockCallbacks),
      ).rejects.toThrow(/Incomplete cached data files/);
    });
  });

  describe('executeDatabaseApplyPhase', () => {
    it('캐시된 데이터를 SQLite에 적용하고 버전을 갱신해야 한다', async () => {
      (
        databaseUpdateService.applyCachedDataToTable as jest.Mock
      ).mockResolvedValue('OK');
      (
        databaseUpdateService.updateDatabaseVersion as jest.Mock
      ).mockResolvedValue('OK');

      const tablesToUpdate = [
        { table: 'pill_data', schemaVer: 2, dataVer: 20260101 },
      ];
      const tableMetadataMap = new Map([
        ['pill_data', { totalPages: 2, totalItems: 10 }],
      ]);

      await executeDatabaseApplyPhase(
        tablesToUpdate,
        tableMetadataMap,
        () => false,
        mockCallbacks,
      );

      expect(databaseUpdateService.applyCachedDataToTable).toHaveBeenCalledWith(
        'pill_data',
        2,
        10,
      );
      expect(databaseUpdateService.updateDatabaseVersion).toHaveBeenCalledWith(
        'pill_data',
        2,
        20260101,
      );
    });
  });

  describe('executeCleanupPhase', () => {
    it('임시 캐시 및 영속 상태를 정리해야 한다', async () => {
      await executeCleanupPhase();

      expect(databaseDownloadService.cleanTempCache).toHaveBeenCalled();
      expect(databaseDownloadService.clearUpdateState).toHaveBeenCalled();
    });
  });

  describe('runPipeline 전체 파이프라인', () => {
    it('모든 단계가 순차적으로 성공하면 완료 상태로 전환해야 한다', async () => {
      (
        databaseDownloadService.fetchAndCachePageData as jest.Mock
      ).mockResolvedValue({
        resource: [{ ITEM_SEQ: '1' }],
        total: 10,
        totalPage: 1,
        current: 1,
      });
      (
        databaseDownloadService.verifyAllTablePagesCached as jest.Mock
      ).mockResolvedValue(true);
      (
        databaseUpdateService.applyCachedDataToTable as jest.Mock
      ).mockResolvedValue('OK');
      (
        databaseUpdateService.updateDatabaseVersion as jest.Mock
      ).mockResolvedValue('OK');

      const currentTableIndexRef = { current: 0 };
      const tablesToUpdate = [
        { table: 'pill_data', schemaVer: 2, dataVer: 20260101 },
      ];

      await databaseSyncOrchestrator.runPipeline(
        tablesToUpdate,
        currentTableIndexRef,
        () => false,
        mockCallbacks,
      );

      expect(mockCallbacks.setUpdateStatus).toHaveBeenCalledWith('completed');
      expect(mockCallbacks.setStatus).toHaveBeenCalledWith('COMPLETED');
    });
  });
});
