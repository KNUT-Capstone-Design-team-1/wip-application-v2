import { databaseUpdateService } from '../../../src/features/database_update/services/database_update_service';
import { databaseUpdateRepository } from '../../../src/features/database_update/data/repositories/database_update_repository';
import { databaseDownloadService } from '../../../src/features/database_update/services/database_download_service';

jest.mock(
  '../../../src/features/database_update/data/repositories/database_update_repository',
  () => ({
    databaseUpdateRepository: {
      getDatabaseVersion: jest.fn(),
      getConfigs: jest.fn(),
      getTableSchema: jest.fn(),
      dropTable: jest.fn(),
      createTable: jest.fn(),
      insertData: jest.fn(),
      getTableRowCount: jest.fn(),
      updateConfigs: jest.fn(),
      getResourceData: jest.fn(),
    },
  }),
);

jest.mock(
  '../../../src/features/database_update/services/database_download_service',
  () => ({
    databaseDownloadService: {
      readCachedPageData: jest.fn(),
      readDownloadedPage: jest.fn(),
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

describe('databaseUpdateService 단위 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    databaseUpdateService.clearVersionCache();
  });

  describe('checkRequireTableUpdate', () => {
    it('서버 버전이 로컬 버전보다 높으면 REQUIRE-UPDATE를 반환해야 한다', async () => {
      (
        databaseUpdateRepository.getDatabaseVersion as jest.Mock
      ).mockResolvedValue({
        pill_data: { schemaVersion: 2, dataVersion: 20260101 },
      });
      (databaseUpdateRepository.getConfigs as jest.Mock).mockResolvedValue([
        { key: 'pillDataSchemaVersion', value: 1 },
        { key: 'pillDataDataVersion', value: 20250101 },
      ]);

      const result =
        await databaseUpdateService.checkRequireTableUpdate('pill_data');

      expect(result.code).toBe('REQUIRE-UPDATE');
      expect(result.newSchemaVersion).toBe(2);
      expect(result.newDataVersion).toBe(20260101);
      expect(result.oldSchemaVersion).toBe(1);
      expect(result.oldDataVersion).toBe(20250101);
    });

    it('서버 버전과 로컬 버전이 같으면 UNNECESSARY-UPDATE를 반환해야 한다', async () => {
      (
        databaseUpdateRepository.getDatabaseVersion as jest.Mock
      ).mockResolvedValue({
        pill_data: { schemaVersion: 1, dataVersion: 20250101 },
      });
      (databaseUpdateRepository.getConfigs as jest.Mock).mockResolvedValue([
        { key: 'pillDataSchemaVersion', value: 1 },
        { key: 'pillDataDataVersion', value: 20250101 },
      ]);

      const result =
        await databaseUpdateService.checkRequireTableUpdate('pill_data');

      expect(result.code).toBe('UNNECESSARY-UPDATE');
    });

    it('로컬 버전 설정이 없으면 REQUIRE-UPDATE를 반환해야 한다', async () => {
      (
        databaseUpdateRepository.getDatabaseVersion as jest.Mock
      ).mockResolvedValue({
        pill_data: { schemaVersion: 1, dataVersion: 20250101 },
      });
      (databaseUpdateRepository.getConfigs as jest.Mock).mockResolvedValue([]);

      const result =
        await databaseUpdateService.checkRequireTableUpdate('pill_data');

      expect(result.code).toBe('REQUIRE-UPDATE');
    });
  });

  describe('initTable', () => {
    it('유효한 스키마가 존재하면 테이블을 삭제하고 다시 생성해야 한다', async () => {
      (databaseUpdateRepository.getTableSchema as jest.Mock).mockResolvedValue({
        columns: [
          {
            name: 'ITEM_SEQ',
            type: 'VARCHAR(255)',
            isPrimaryKey: true,
            isNullable: false,
          },
        ],
      });
      (databaseUpdateRepository.dropTable as jest.Mock).mockResolvedValue(
        undefined,
      );
      (databaseUpdateRepository.createTable as jest.Mock).mockResolvedValue(
        undefined,
      );

      const result = await databaseUpdateService.initTable('pill_data');

      expect(result).toBe('OK');
      expect(databaseUpdateRepository.dropTable).toHaveBeenCalledWith(
        'pill_data',
      );
      expect(databaseUpdateRepository.createTable).toHaveBeenCalledWith(
        'pill_data',
        expect.any(Array),
      );
    });

    it('스키마 컬럼이 없으면 INVALID-SCHEMA를 반환해야 한다', async () => {
      (databaseUpdateRepository.getTableSchema as jest.Mock).mockResolvedValue({
        columns: [],
      });

      const result = await databaseUpdateService.initTable('pill_data');
      expect(result).toBe('INVALID-SCHEMA');
    });
  });

  describe('installTableFromFiles', () => {
    it('다운로드된 모든 페이지를 정상적으로 SQLite에 삽입하고 검증해야 한다', async () => {
      (databaseUpdateRepository.getTableSchema as jest.Mock).mockResolvedValue({
        columns: [
          {
            name: 'ITEM_SEQ',
            type: 'VARCHAR(255)',
            isPrimaryKey: true,
            isNullable: false,
          },
        ],
      });
      (databaseDownloadService.readCachedPageData as jest.Mock)
        .mockResolvedValueOnce({
          resource: [{ ITEM_SEQ: '1' }, { ITEM_SEQ: '2' }],
          total: 3,
          totalPage: 2,
        })
        .mockResolvedValueOnce({
          resource: [{ ITEM_SEQ: '3' }],
          total: 3,
          totalPage: 2,
        });
      (
        databaseUpdateRepository.getTableRowCount as jest.Mock
      ).mockResolvedValue(3);

      const onProgress = jest.fn();
      const result = await databaseUpdateService.applyCachedDataToTable(
        'pill_data',
        2,
        3,
        onProgress,
      );

      expect(result).toBe('OK');
      expect(databaseUpdateRepository.insertData).toHaveBeenCalledTimes(2);
      expect(onProgress).toHaveBeenCalledWith(1, 2);
      expect(onProgress).toHaveBeenCalledWith(2, 2);
    });

    it('행 개수가 기대값과 다르면 [VERIFICATION_FAILED] 에러를 던져야 한다', async () => {
      (databaseUpdateRepository.getTableSchema as jest.Mock).mockResolvedValue({
        columns: [{ name: 'id', type: 'INT' }],
      });
      (
        databaseDownloadService.readCachedPageData as jest.Mock
      ).mockResolvedValue({
        resource: [{ id: 1 }],
        total: 2,
        totalPage: 1,
      });
      (
        databaseUpdateRepository.getTableRowCount as jest.Mock
      ).mockResolvedValue(1); // 기대값은 2인데 실제값 1

      await expect(
        databaseUpdateService.installTableFromFiles('pill_data', 1, 2),
      ).rejects.toThrow(/\[VERIFICATION_FAILED\]/);
    });
  });

  describe('updateDatabaseVersion', () => {
    it('버전 정보를 올바르게 업데이트해야 한다', async () => {
      (databaseUpdateRepository.updateConfigs as jest.Mock).mockResolvedValue(
        undefined,
      );

      const result = await databaseUpdateService.updateDatabaseVersion(
        'pill_data',
        2,
        20260101,
      );

      expect(result).toBe('OK');
      expect(databaseUpdateRepository.updateConfigs).toHaveBeenCalledWith([
        { key: 'pillDataSchemaVersion', value: 2 },
        { key: 'pillDataDataVersion', value: 20260101 },
      ]);
    });
  });
});
