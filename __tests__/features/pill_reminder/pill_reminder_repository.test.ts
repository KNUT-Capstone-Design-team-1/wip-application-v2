import { PillReminderRepository } from '../../../src/features/pill_reminder/data/repositories/pill_reminder_repository';
import { IPillReminderSqliteDataSource } from '../../../src/features/pill_reminder/data/datasources/pill_reminder_sqlite_datasource';

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

describe('PillReminderRepository 단위 테스트', () => {
  let repository: PillReminderRepository;
  let mockDataSource: jest.Mocked<IPillReminderSqliteDataSource>;

  beforeEach(() => {
    mockDataSource = {
      getAllReminders: jest.fn().mockResolvedValue([]),
      getRemindersByItemSeq: jest.fn().mockResolvedValue([]),
      getReminderById: jest.fn().mockResolvedValue(null),
      getReminderItemsByReminderIds: jest.fn().mockResolvedValue([]),
      getReminderItemsByReminderId: jest.fn().mockResolvedValue([]),
      getPillDataBySeqs: jest.fn().mockResolvedValue([]),
      getSavedPillsBySeqs: jest.fn().mockResolvedValue([]),
      getFolderInfoByItemSeq: jest.fn().mockResolvedValue(null),
      getSavedPillFolderIdByItemSeq: jest.fn().mockResolvedValue(1),
      getExistingReminderCount: jest.fn().mockResolvedValue(0),
      getFolders: jest.fn().mockResolvedValue([]),
      getPillsByFolder: jest.fn().mockResolvedValue([]),
      getRemindedItemSeqs: jest.fn().mockResolvedValue([]),
      insertReminderWithItems: jest.fn().mockResolvedValue([1]),
      updateReminderWithItems: jest.fn().mockResolvedValue(undefined),
      toggleReminder: jest.fn().mockResolvedValue(true),
      deleteReminder: jest.fn().mockResolvedValue(true),
      deleteAllReminders: jest.fn().mockResolvedValue(true),
    };
    repository = new PillReminderRepository(mockDataSource);
  });

  it('getAllReminders 호출을 Data Source로 위임해야 한다', async () => {
    await repository.getAllReminders();
    expect(mockDataSource.getAllReminders).toHaveBeenCalled();
  });

  it('getReminderById 호출을 Data Source로 위임해야 한다', async () => {
    await repository.getReminderById(10);
    expect(mockDataSource.getReminderById).toHaveBeenCalledWith(10);
  });

  it('toggleReminder 호출을 Data Source로 위임해야 한다', async () => {
    await repository.toggleReminder(10, true);
    expect(mockDataSource.toggleReminder).toHaveBeenCalledWith(10, true);
  });

  it('deleteReminder 호출을 Data Source로 위임해야 한다', async () => {
    await repository.deleteReminder(10);
    expect(mockDataSource.deleteReminder).toHaveBeenCalledWith(10);
  });
});
