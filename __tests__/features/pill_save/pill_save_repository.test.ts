import { PillSaveRepository } from '../../../src/features/pill_save/data/repositories/pill_save_repository';
import { IPillSaveDataSource } from '../../../src/features/pill_save/data/datasources/pill_save_sqlite_datasource';

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

describe('PillSaveRepository 단위 테스트', () => {
  let repository: PillSaveRepository;
  let mockDataSource: jest.Mocked<IPillSaveDataSource>;

  beforeEach(() => {
    mockDataSource = {
      getFolders: jest.fn().mockResolvedValue([]),
      getFolderPreviewImages: jest.fn().mockResolvedValue([]),
      createFolder: jest.fn().mockResolvedValue(1),
      renameFolder: jest.fn().mockResolvedValue(true),
      deleteFolder: jest.fn().mockResolvedValue(true),
      deleteMultiplePills: jest.fn().mockResolvedValue(true),
      getPillSavedFolderIds: jest.fn().mockResolvedValue([]),
      savePillToFolders: jest.fn().mockResolvedValue(undefined),
      movePillsToFolders: jest
        .fn()
        .mockResolvedValue({ alreadyExistsItems: [] }),
      copyPillsToFolders: jest
        .fn()
        .mockResolvedValue({ alreadyExistsItems: [] }),
      deletePillFromFolder: jest.fn().mockResolvedValue(true),
      getPillsByFolder: jest.fn().mockResolvedValue([]),
    };
    repository = new PillSaveRepository(mockDataSource);
  });

  it('getFolders 호출을 Data Source로 위임해야 한다', async () => {
    await repository.getFolders('f.name ASC');
    expect(mockDataSource.getFolders).toHaveBeenCalledWith('f.name ASC');
  });

  it('createFolder 호출을 Data Source로 위임해야 한다', async () => {
    await repository.createFolder('내 폴더');
    expect(mockDataSource.createFolder).toHaveBeenCalledWith('내 폴더');
  });

  it('deleteMultiplePills 호출을 Data Source로 위임해야 한다', async () => {
    await repository.deleteMultiplePills(['123', '456'], 1);
    expect(mockDataSource.deleteMultiplePills).toHaveBeenCalledWith(
      ['123', '456'],
      1,
    );
  });
});
