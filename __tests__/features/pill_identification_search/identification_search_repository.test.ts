import { IdentificationSearchRepository } from '../../../src/features/pill_identification_search/data/repositories/identification_search_repository';
import { IIdentificationSearchSqliteDataSource } from '../../../src/features/pill_identification_search/data/datasources/identification_search_sqlite_datasource';

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

describe('IdentificationSearchRepository 단위 테스트', () => {
  let mockDataSource: jest.Mocked<IIdentificationSearchSqliteDataSource>;
  let repository: IdentificationSearchRepository;

  beforeEach(() => {
    mockDataSource = {
      getPillDatas: jest.fn(),
      getPillDataCount: jest.fn(),
      getMarkImages: jest.fn(),
    };
    repository = new IdentificationSearchRepository(mockDataSource);
  });

  test('searchPills가 데이터소스로 조회를 올바르게 위임한다', async () => {
    const mockPills = [{ ITEM_SEQ: '12345', ITEM_NAME: '테스트약' } as any];
    mockDataSource.getPillDatas.mockResolvedValue(mockPills);

    const result = await repository.searchPills(
      { ITEM_NAME: '테스트약' },
      { page: 1, limit: 30 },
    );

    expect(mockDataSource.getPillDatas).toHaveBeenCalledWith(
      { ITEM_NAME: '테스트약' },
      { page: 1, limit: 30 },
    );
    expect(result).toEqual(mockPills);
  });

  test('countPills가 데이터소스로 개수 조회를 올바르게 위임한다', async () => {
    mockDataSource.getPillDataCount.mockResolvedValue(42);

    const result = await repository.countPills({ ITEM_NAME: '테스트약' });

    expect(mockDataSource.getPillDataCount).toHaveBeenCalledWith({
      ITEM_NAME: '테스트약',
    });
    expect(result).toBe(42);
  });
});
