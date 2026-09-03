import { NearbyPharmacyRepository } from '../../../src/features/nearby_pharmacy/data/repositories/nearby_pharmacy_repository';
import { IPharmacyDataSource } from '../../../src/features/nearby_pharmacy/data/datasources/pharmacy_sqlite_datasource';

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

describe('NearbyPharmacyRepository 단위 테스트', () => {
  let repository: NearbyPharmacyRepository;
  let mockDataSource: jest.Mocked<IPharmacyDataSource>;

  beforeEach(() => {
    mockDataSource = {
      getNearbyPharmacies: jest.fn().mockResolvedValue([]),
    };
    repository = new NearbyPharmacyRepository(mockDataSource);
  });

  it('기본 옵션(page 1, limit 50)을 채워서 Data Source에 질의해야 한다', async () => {
    const coords = { x: 126.978, y: 37.5665 };
    await repository.getNearbyPharmacies({ coordinate: coords });

    expect(mockDataSource.getNearbyPharmacies).toHaveBeenCalledWith(
      { coordinate: coords },
      { page: 1, limit: 50 },
    );
  });

  it('지정된 옵션으로 Data Source에 질의해야 한다', async () => {
    const coords = { x: 126.978, y: 37.5665 };
    await repository.getNearbyPharmacies(
      { coordinate: coords },
      { page: 2, limit: 20 },
    );

    expect(mockDataSource.getNearbyPharmacies).toHaveBeenCalledWith(
      { coordinate: coords },
      { page: 2, limit: 20 },
    );
  });
});
