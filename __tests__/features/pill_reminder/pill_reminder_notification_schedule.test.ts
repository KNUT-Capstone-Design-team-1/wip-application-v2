import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { pillReminderNotificationScheduleDataSource } from '../../../src/features/pill_reminder/data/datasources/pill_reminder_notification_schedule_datasource';
import { pillReminderNotificationService } from '../../../src/features/pill_reminder/services/pill_reminder_notification_service';
import { pillReminderQueryService } from '../../../src/features/pill_reminder/services/pill_reminder_query_service';

jest.mock('../../../src/services/database/sqlite', () => ({
  getDatabase: jest.fn(() =>
    Promise.resolve({
      execAsync: jest.fn(() => Promise.resolve()),
      withTransactionAsync: jest.fn((cb: () => Promise<void>) => cb()),
      runAsync: jest.fn(() => Promise.resolve({ changes: 1 })),
      getAllAsync: jest.fn(() => Promise.resolve([])),
      getFirstAsync: jest.fn(() => Promise.resolve(null)),
    }),
  ),
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  },
}));

jest.mock('expo-application', () => ({
  applicationId: 'com.example.whatispill',
}));

jest.mock('expo-intent-launcher', () => ({
  startActivityAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-notifications', () => {
  const scheduled: any[] = [];
  return {
    setNotificationHandler: jest.fn(),
    getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    requestPermissionsAsync: jest.fn(() =>
      Promise.resolve({ status: 'granted' }),
    ),
    setNotificationCategoryAsync: jest.fn(() => Promise.resolve()),
    setNotificationChannelAsync: jest.fn(() => Promise.resolve()),
    getAllScheduledNotificationsAsync: jest.fn(() =>
      Promise.resolve([...scheduled]),
    ),
    cancelAllScheduledNotificationsAsync: jest.fn(() => {
      scheduled.length = 0;
      return Promise.resolve();
    }),
    scheduleNotificationAsync: jest.fn((request) => {
      const id = `notif-${Date.now()}-${Math.random()}`;
      scheduled.push({
        identifier: id,
        content: request.content,
        trigger: request.trigger,
      });
      return Promise.resolve(id);
    }),
    getNextTriggerDateAsync: jest.fn(() => Promise.resolve(Date.now() + 60000)),
    AndroidImportance: { MAX: 5, HIGH: 4 },
    AndroidNotificationVisibility: { PUBLIC: 1 },
    SchedulableTriggerInputTypes: {
      WEEKLY: 'weekly',
      TIME_INTERVAL: 'timeInterval',
    },
    DEFAULT_ACTION_IDENTIFIER: 'expo.modules.notifications.actions.DEFAULT',
  };
});

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('Pill Reminder Notification Scheduling Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Minimal Trigger & Isolation Tests', () => {
    it('Test A: Minimal TIME_INTERVAL schedule should succeed', async () => {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: '10초 테스트',
          body: '최소 알림 본문',
          sound: 'default',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 10,
          repeats: false,
        },
      });

      expect(id).toBeDefined();
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: '10초 테스트',
            body: '최소 알림 본문',
          }),
        }),
      );
    });

    it('Test B: Weekly Notification Request should build valid trigger format', async () => {
      const id =
        await pillReminderNotificationScheduleDataSource.scheduleWeeklyNotification(
          {
            title: '[혈압약]',
            body: '아침 약 복용 시간입니다.',
            weekday: 2,
            hour: 8,
            minute: 30,
            data: { reminderId: 101 },
          },
        );

      expect(id).toBeDefined();
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: '[혈압약]',
            body: '아침 약 복용 시간입니다.',
            categoryIdentifier: 'PILL_REMINDER_CATEGORY',
          }),
          trigger: expect.objectContaining({
            type: 'weekly',
            weekday: 2,
            hour: 8,
            minute: 30,
            ...(Platform.OS === 'android'
              ? { channelId: 'pill-reminder' }
              : {}),
          }),
        }),
      );
    });
  });

  describe('2. Multi-Schedule & Days Mapping Verification', () => {
    it('should schedule 7 individual weekly notifications for a 7-day reminder', async () => {
      jest.spyOn(pillReminderQueryService, 'getReminders').mockResolvedValue([
        {
          id: 1,
          folder_id: null,
          title: '매일 영양제',
          memo: '식후 30분',
          time: '17:33',
          times: ['17:33'],
          days: [0, 1, 2, 3, 4, 5, 6],
          is_enabled: 1,
          created_at: '2026-09-07 00:00:00',
          updated_at: '2026-09-07 00:00:00',
          items: [
            {
              id: 1,
              reminder_id: 1,
              item_seq: '1990001',
              item_name: '오메가3',
              dosage: 1,
            },
          ],
        },
      ]);

      const summary =
        await pillReminderNotificationService.rescheduleAllNotificationsInternal();

      expect(summary.total).toBe(7);
      expect(summary.success).toBe(7);
      expect(summary.failed).toBe(0);
      expect(summary.failures).toHaveLength(0);
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(7);
    });

    it('should isolate failures when a single schedule call throws', async () => {
      jest.spyOn(pillReminderQueryService, 'getReminders').mockResolvedValue([
        {
          id: 2,
          folder_id: null,
          title: '비타민',
          memo: null,
          time: '09:00',
          times: ['09:00'],
          days: [1, 2],
          is_enabled: 1,
          created_at: '2026-09-07 00:00:00',
          updated_at: '2026-09-07 00:00:00',
          items: [
            {
              id: 2,
              reminder_id: 2,
              item_seq: '1990002',
              item_name: '비타민C',
              dosage: 1,
            },
          ],
        },
      ]);

      let callCount = 0;
      jest
        .spyOn(Notifications, 'scheduleNotificationAsync')
        .mockImplementation(async () => {
          callCount += 1;
          if (callCount === 1) {
            throw new Error('Failed to schedule the notification.');
          }
          return 'notif-success-2';
        });

      const summary =
        await pillReminderNotificationService.rescheduleAllNotificationsInternal();

      expect(summary.total).toBe(2);
      expect(summary.success).toBe(1);
      expect(summary.failed).toBe(1);
      expect(summary.failures).toHaveLength(1);
      expect(summary.failures[0].reminderId).toBe(2);
    });
  });
});
