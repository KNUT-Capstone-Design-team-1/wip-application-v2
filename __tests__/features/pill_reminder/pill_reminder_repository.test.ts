import { pillReminderRepository } from '../../../src/features/pill_reminder/data/repositories/pill_reminder_repository';
import { pillReminderSqliteDataSource } from '../../../src/features/pill_reminder/data/datasources/pill_reminder_sqlite_datasource';

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

describe('pillReminderRepository 단위 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAllReminders 호출을 Data Source로 위임해야 한다', async () => {
    const spy = jest
      .spyOn(pillReminderSqliteDataSource, 'getAllReminders')
      .mockResolvedValue([]);

    await pillReminderRepository.getAllReminders();
    expect(spy).toHaveBeenCalled();
  });

  it('getReminderById 호출을 Data Source로 위임해야 한다', async () => {
    const spy = jest
      .spyOn(pillReminderSqliteDataSource, 'getReminderById')
      .mockResolvedValue(null);

    await pillReminderRepository.getReminderById(10);
    expect(spy).toHaveBeenCalledWith(10);
  });

  it('toggleReminder 호출을 Data Source로 위임해야 한다', async () => {
    const spy = jest
      .spyOn(pillReminderSqliteDataSource, 'toggleReminder')
      .mockResolvedValue(true);

    await pillReminderRepository.toggleReminder(10, true);
    expect(spy).toHaveBeenCalledWith(10, true);
  });

  it('deleteReminder 호출을 Data Source로 위임해야 한다', async () => {
    const spy = jest
      .spyOn(pillReminderSqliteDataSource, 'deleteReminder')
      .mockResolvedValue(true);

    await pillReminderRepository.deleteReminder(10);
    expect(spy).toHaveBeenCalledWith(10);
  });
});
