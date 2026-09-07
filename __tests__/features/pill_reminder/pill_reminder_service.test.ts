import { pillReminderService } from '../../../src/features/pill_reminder/services/pill_reminder_service';
import { pillReminderNotificationService } from '../../../src/features/pill_reminder/services/pill_reminder_notification_service';
import { pillReminderQueryService } from '../../../src/features/pill_reminder/services/pill_reminder_query_service';
import { pillReminderNotificationRepository } from '../../../src/features/pill_reminder/data/repositories/pill_reminder_notification_repository';
import { Platform, PermissionsAndroid } from 'react-native';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  },
}));

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' }),
  ),
  setNotificationChannelAsync: jest.fn(() => Promise.resolve()),
  getAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve([])),
  cancelAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve()),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('notif-1')),
  getNextTriggerDateAsync: jest.fn(() => Promise.resolve(Date.now() + 60000)),
  AndroidImportance: { HIGH: 4 },
  SchedulableTriggerInputTypes: {
    WEEKLY: 'weekly',
    TIME_INTERVAL: 'time_interval',
  },
  DEFAULT_ACTION_IDENTIFIER: 'expo.modules.notifications.actions.DEFAULT',
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

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
    const s = sql.replace(/\s+/g, ' ').trim();

    if (s.includes('INSERT INTO pill_reminders')) {
      const id = nextReminderId++;
      remindersDb.push({
        id,
        folder_id: params[0],
        title: params[1],
        memo: params[2],
        times: params[3],
        days: params[4],
        is_enabled: 1,
        created_at: '2026-09-02 08:00:00',
        updated_at: '2026-09-02 08:00:00',
      });
      return Promise.resolve({ lastInsertRowId: id, changes: 1 });
    }
    if (
      s.includes('INSERT INTO pill_reminder_items') ||
      s.includes('INSERT OR REPLACE INTO pill_reminder_items')
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
    if (s.includes('DELETE FROM pill_reminders WHERE id = ?')) {
      const idx = remindersDb.findIndex((r) => r.id === params[0]);

      if (idx !== -1) {
        remindersDb.splice(idx, 1);
      }

      return Promise.resolve({ changes: 1 });
    }
    if (s === 'DELETE FROM pill_reminders') {
      remindersDb.length = 0;
      return Promise.resolve({ changes: 1 });
    }
    if (s.includes('UPDATE pill_reminders SET is_enabled = ?')) {
      const r = remindersDb.find((r) => r.id === params[1]);

      if (r) {
        r.is_enabled = params[0];
      }

      return Promise.resolve({ changes: 1 });
    }
    if (s.includes('UPDATE pill_reminders SET folder_id = ?')) {
      const r = remindersDb.find((r) => r.id === params[5]);
      if (r) {
        r.folder_id = params[0];
        r.title = params[1];
        r.memo = params[2];
        r.times = params[3];
        r.days = params[4];
      }
      return Promise.resolve({ changes: 1 });
    }
    if (s.includes('DELETE FROM pill_reminder_items WHERE reminder_id = ?')) {
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
    const s = sql.replace(/\s+/g, ' ').trim();

    if (s.includes('SELECT * FROM pill_reminders')) {
      return Promise.resolve(remindersDb);
    }
    if (s.includes('FROM pill_reminder_items pri')) {
      if (s.includes('WHERE pr.folder_id = ?')) {
        const folderId = params[0];
        const targetReminderIds = remindersDb
          .filter((r) => r.folder_id === folderId)
          .map((r) => r.id);
        const matchedItems = reminderItemsDb.filter((item) =>
          targetReminderIds.includes(item.reminder_id),
        );
        const distinctSeqs = Array.from(
          new Set(matchedItems.map((i) => i.item_seq)),
        );
        return Promise.resolve(distinctSeqs.map((s) => ({ item_seq: s })));
      }
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
    if (s.includes('SELECT DISTINCT item_seq FROM pill_reminder_items')) {
      const distinctSeqs = Array.from(
        new Set(reminderItemsDb.map((i) => i.item_seq)),
      );
      return Promise.resolve(distinctSeqs.map((seq) => ({ item_seq: seq })));
    }
    return Promise.resolve([]);
  }),
  getFirstAsync: jest.fn((sql: string, params: any[] = []) => {
    const s = sql.replace(/\s+/g, ' ').trim();

    if (s.includes('SELECT COUNT(*) as count FROM pill_reminders')) {
      return Promise.resolve({ count: remindersDb.length });
    }
    if (s.includes('SELECT folder_id FROM saved_pills')) {
      return Promise.resolve({ folder_id: 1 });
    }
    if (s.includes('SELECT * FROM pill_reminders WHERE id = ?')) {
      const found = remindersDb.find((r) => r.id === params[0]);
      return Promise.resolve(found || null);
    }
    return Promise.resolve(null);
  }),
};

jest.mock('../../../src/services/database/sqlite', () => ({
  getDatabase: jest.fn(() => Promise.resolve(mockDb)),
}));

describe('PillReminderNotification permission state', () => {
  beforeEach(() => {
    Platform.OS = 'android';
    PermissionsAndroid.check = jest.fn(() => Promise.resolve(true));
  });

  test('알림 권한과 Exact Alarm 상태를 분리해서 확인한다', async () => {
    const notifications = require('expo-notifications');
    jest.spyOn(notifications, 'getPermissionsAsync').mockResolvedValueOnce({
      status: 'granted',
      canAskAgain: true,
    });

    jest.spyOn(PermissionsAndroid, 'check').mockResolvedValueOnce(true);

    const state =
      await pillReminderNotificationService.getNotificationPermissionState();

    expect(state.notificationGranted).toBe(true);
    expect(state.exactAlarmGranted).toBe(true);
  });

  test('재등록 중 실패한 알림은 나머지 알림을 지속시키고 결과를 반환한다', async () => {
    const reminderSpy = jest.spyOn(pillReminderQueryService, 'getReminders');

    reminderSpy.mockResolvedValueOnce([
      {
        id: 1,
        title: '아침 약',
        items: [{ item_name: '타이레놀', dosage: 1 }],
        memo: '',
        days: [1, 2, 3],
        times: ['08:00'],
        is_enabled: 1,
      },
      {
        id: 2,
        title: '저녁 약',
        items: [{ item_name: '비타민', dosage: 1 }],
        memo: '',
        days: [1, 2, 3],
        times: ['20:00'],
        is_enabled: 1,
      },
    ]);

    const scheduleSpy = jest.spyOn(
      pillReminderNotificationRepository,
      'scheduleWeeklyNotification',
    );

    scheduleSpy
      .mockRejectedValueOnce(new Error('schedule failed'))
      .mockResolvedValueOnce('scheduled-2');

    const result =
      await pillReminderNotificationService.rescheduleAllNotifications();

    expect(result.total).toBe(6);
    expect(result.success).toBe(5);
    expect(result.failed).toBe(1);
    expect(result.failures[0].reminderId).toBe(1);
  });
});

test('주간 알림 예약은 JSON-safe 데이터만 전달한다', async () => {
  const scheduleSpy = jest.spyOn(
    require('expo-notifications'),
    'scheduleNotificationAsync',
  );

  await require('../../../src/features/pill_reminder/data/datasources/pill_reminder_notification_datasource').pillReminderNotificationDataSource.scheduleWeeklyNotification(
    {
      title: '약 알림',
      body: '복용할 시간입니다',
      weekday: 2,
      hour: 8,
      minute: 0,
      data: {
        reminderId: 123,
        meta: { nested: 'value' },
      },
    },
  );

  const payload = scheduleSpy.mock.calls[0][0];
  expect(payload.content.data).toEqual({
    reminderId: 123,
    meta: '{"nested":"value"}',
  });
});

describe('PillReminderService 3-Tier CRUD 통합 테스트', () => {
  beforeEach(() => {
    remindersDb.length = 0;
    reminderItemsDb.length = 0;
    nextReminderId = 1;
    nextItemId = 1;
  });

  test('복용 알림 생성 및 조회 (folder_id, 자동 이름 부여 및 다중 복용 시간 단일 알림 관리)', async () => {
    const createdIds = await pillReminderService.createReminders({
      folder_id: 1,
      times: ['08:00', '20:00'],
      days: [1, 2, 3, 4, 5],
      memo: '식후 30분 복용',
      items: [
        { item_seq: '199303108', item_name: '타이레놀', dosage: 1 },
        { item_seq: '200001001', item_name: '비타민C', dosage: 2 },
      ],
    });

    // 이제 2개 시간을 지정해도 1개의 단일 알림 레코드로 관리됨
    expect(createdIds).toHaveLength(1);
    expect(remindersDb).toHaveLength(1);

    const allReminders = await pillReminderService.getReminders();
    expect(allReminders).toHaveLength(1);
    expect(allReminders[0].folder_id).toBe(1);
    expect(allReminders[0].title).toBe('알림 1');
    expect(allReminders[0].memo).toBe('식후 30분 복용');
    expect(allReminders[0].times).toEqual(['08:00', '20:00']);
    expect(allReminders[0].time).toBe('08:00');
    expect(allReminders[0].days).toEqual([1, 2, 3, 4, 5]);
  });

  test('특정 폴더에 등록된 item_seq 목록만 정확히 조회', async () => {
    await pillReminderService.createReminders({
      folder_id: 1,
      title: '폴더1 알림',
      times: ['08:00'],
      days: [0, 1, 2, 3, 4, 5, 6],
      items: [{ item_seq: '199303108', item_name: '타이레놀', dosage: 1 }],
    });

    const folder1Seqs = await pillReminderService.getRemindedItemSeqs(1);
    expect(folder1Seqs).toContain('199303108');

    const folder2Seqs = await pillReminderService.getRemindedItemSeqs(2);
    expect(folder2Seqs).not.toContain('199303108');
  });

  test('복용 알림 수정', async () => {
    const createdIds = await pillReminderService.createReminders({
      folder_id: 1,
      title: '아침약',
      times: ['08:00'],
      days: [0, 1, 2, 3, 4, 5, 6],
      items: [{ item_seq: '199303108', item_name: '타이레놀', dosage: 1 }],
    });

    const reminderId = createdIds[0];

    const success = await pillReminderService.updateReminder({
      id: reminderId,
      folder_id: 1,
      title: '아침 식후약',
      memo: '물 많이 마시기',
      times: ['09:00', '18:00'],
      days: [1, 2, 3, 4, 5],
      items: [{ item_seq: '199303108', item_name: '타이레놀', dosage: 2 }],
    });

    expect(success).toBe(true);

    const updated = await pillReminderService.getReminderById(reminderId);
    expect(updated?.title).toBe('아침 식후약');
    expect(updated?.memo).toBe('물 많이 마시기');
    expect(updated?.times).toEqual(['09:00', '18:00']);
  });

  test('복용 알림 단일 삭제', async () => {
    const createdIds = await pillReminderService.createReminders({
      folder_id: 1,
      times: ['08:00'],
      days: [0, 1, 2, 3, 4, 5, 6],
      items: [{ item_seq: '199303108', item_name: '타이레놀', dosage: 1 }],
    });

    const success = await pillReminderService.deleteReminder(createdIds[0]);
    expect(success).toBe(true);
    expect(remindersDb).toHaveLength(0);
  });

  test('모든 복용 알림 전체 삭제', async () => {
    await pillReminderService.createReminders({
      folder_id: 1,
      times: ['08:00', '13:00', '19:00'],
      days: [1, 2, 3, 4, 5],
      items: [{ item_seq: '199303108', item_name: '타이레놀', dosage: 1 }],
    });

    expect(remindersDb).toHaveLength(1);

    const success = await pillReminderService.deleteAllReminders();
    expect(success).toBe(true);
    expect(remindersDb).toHaveLength(0);
  });
});
