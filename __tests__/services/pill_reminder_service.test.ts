import { pillReminderService } from '../../src/features/pill_reminder/services/pill_reminder_service';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const remindersDb: any[] = [];
const reminderItemsDb: any[] = [];
let nextReminderId = 1;
let nextItemId = 1;

const mockDb = {
  execAsync: jest.fn(() => Promise.resolve()),
  withTransactionAsync: jest.fn(async (callback: () => Promise<void>) => {
    await callback();
  }),
  runAsync: jest.fn((sql: string, params: any[] = []) => {
    if (sql.includes('INSERT INTO pill_reminders')) {
      const id = nextReminderId++;
      remindersDb.push({
        id,
        time: params[0],
        days: params[1],
        is_enabled: 1,
        created_at: '2026-09-02 08:00:00',
        updated_at: '2026-09-02 08:00:00',
      });
      return Promise.resolve({ lastInsertRowId: id, changes: 1 });
    }
    if (
      sql.includes('INSERT INTO pill_reminder_items') ||
      sql.includes('INSERT OR REPLACE INTO pill_reminder_items')
    ) {
      const id = nextItemId++;

      reminderItemsDb.push({
        id,
        reminder_id: params[0],
        item_seq: params[1],
        item_name: params[2],
        dosage: params[3],
      });

      return Promise.resolve({ lastInsertRowId: id, changes: 1 });
    }
    if (sql.includes('DELETE FROM pill_reminders WHERE id = ?')) {
      const idx = remindersDb.findIndex((r) => r.id === params[0]);

      if (idx !== -1) {
        remindersDb.splice(idx, 1);
      }

      return Promise.resolve({ changes: 1 });
    }
    if (sql.includes('UPDATE pill_reminders SET is_enabled = ?')) {
      const r = remindersDb.find((r) => r.id === params[1]);

      if (r) {
        r.is_enabled = params[0];
      }

      return Promise.resolve({ changes: 1 });
    }
    if (sql.includes('UPDATE pill_reminders SET time = ?')) {
      const r = remindersDb.find((r) => r.id === params[2]);
      if (r) {
        r.time = params[0];
        r.days = params[1];
      }
      return Promise.resolve({ changes: 1 });
    }
    if (sql.includes('DELETE FROM pill_reminder_items WHERE reminder_id = ?')) {
      for (let i = reminderItemsDb.length - 1; i >= 0; i--) {
        if (reminderItemsDb[i].reminder_id === params[0]) {
          reminderItemsDb.splice(i, 1);
        }
      }
      return Promise.resolve({ changes: 1 });
    }
    return Promise.resolve({ changes: 1, lastInsertRowId: 1 });
  }),
  getAllAsync: jest.fn((sql: string, params: any[] = []) => {
    if (sql.includes('SELECT * FROM pill_reminders')) {
      return Promise.resolve(remindersDb);
    }
    if (sql.includes('FROM pill_reminder_items')) {
      return Promise.resolve(
        reminderItemsDb.map((item) => ({
          id: item.id,
          reminder_id: item.reminder_id,
          item_seq: item.item_seq,
          item_name: item.item_name,
          dosage: item.dosage,
          ITEM_IMAGE: '',
          CLASS_NAME: '진통제',
          ENTP_NAME: '한국얀센',
        })),
      );
    }
    if (sql.includes('SELECT DISTINCT item_seq FROM pill_reminder_items')) {
      const distinctSeqs = Array.from(
        new Set(reminderItemsDb.map((i) => i.item_seq)),
      );
      return Promise.resolve(distinctSeqs.map((s) => ({ item_seq: s })));
    }
    return Promise.resolve([]);
  }),
  getFirstAsync: jest.fn((sql: string, params: any[] = []) => {
    if (sql.includes('SELECT * FROM pill_reminders WHERE id = ?')) {
      const found = remindersDb.find((r) => r.id === params[0]);
      return Promise.resolve(found || null);
    }
    return Promise.resolve(null);
  }),
};

jest.mock('../../src/services/database/sqlite', () => ({
  getDatabase: jest.fn(() => Promise.resolve(mockDb)),
}));

describe('PillReminderService CRUD 테스트', () => {
  beforeEach(() => {
    remindersDb.length = 0;
    reminderItemsDb.length = 0;
    nextReminderId = 1;
    nextItemId = 1;
  });

  test('복용 알림 생성 및 조회', async () => {
    const createdIds = await pillReminderService.createReminders({
      times: ['08:00', '20:00'],
      days: [1, 2, 3, 4, 5],
      items: [
        { item_seq: '199303108', item_name: '타이레놀', dosage: 1 },
        { item_seq: '200001001', item_name: '비타민C', dosage: 2 },
      ],
    });

    expect(createdIds).toHaveLength(2);
    expect(remindersDb).toHaveLength(2);

    const allReminders = await pillReminderService.getReminders();
    expect(allReminders).toHaveLength(2);
    expect(allReminders[0].time).toBe('08:00');
    expect(allReminders[0].days).toEqual([1, 2, 3, 4, 5]);
  });

  test('알림 등록된 item_seq 목록 조회', async () => {
    await pillReminderService.createReminders({
      times: ['08:00'],
      days: [0, 1, 2, 3, 4, 5, 6],
      items: [{ item_seq: '199303108', item_name: '타이레놀', dosage: 1 }],
    });

    const seqs = await pillReminderService.getRemindedItemSeqs();
    expect(seqs).toContain('199303108');
  });

  test('복용 알림 삭제', async () => {
    const createdIds = await pillReminderService.createReminders({
      times: ['08:00'],
      days: [0, 1, 2, 3, 4, 5, 6],
      items: [{ item_seq: '199303108', item_name: '타이레놀', dosage: 1 }],
    });

    const success = await pillReminderService.deleteReminder(createdIds[0]);
    expect(success).toBe(true);
    expect(remindersDb).toHaveLength(0);
  });
});
