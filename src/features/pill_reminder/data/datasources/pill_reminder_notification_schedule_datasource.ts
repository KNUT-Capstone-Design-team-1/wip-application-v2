import * as Notifications from 'expo-notifications';
import {
  IScheduleSnoozeNotificationParams,
  IScheduleWeeklyNotificationParams,
} from '@features/pill_reminder/types/pill_reminder_data_type';
import {
  NOTIFICATION_CATEGORY_REMINDER,
  NOTIFICATION_CHANNEL_ID,
} from '@features/pill_reminder/constants/reminder_notification_constant';
import { ScheduledNotificationSummarySource } from '@features/pill_reminder/types/pill_reminder_notification_type';
import logger from '@utils/logger';

const sanitizeNotificationData = (data?: Record<string, unknown>) => {
  const hasNoData = !data;
  if (hasNoData) {
    return {};
  }

  const sanitizer = (value: unknown): string | number | boolean | null => {
    const isEmptyValue = value === undefined || value === null;
    if (isEmptyValue) {
      return null;
    }

    const isPrimitiveValue =
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean';
    if (isPrimitiveValue) {
      return value;
    }

    const isDateValue = value instanceof Date;
    if (isDateValue) {
      return value.toISOString();
    }

    const isObjectValue = typeof value === 'object';
    if (isObjectValue) {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }

    return String(value);
  };

  return Object.entries(data).reduce<
    Record<string, string | number | boolean | null>
  >((acc, [key, value]) => {
    acc[key] = sanitizer(value);
    return acc;
  }, {});
};

// 예약 알림과 예약 목록 로그를 담당한다.
export const pillReminderNotificationScheduleDataSource = {
  // 실제 OS에 등록된 예약 알림 목록을 로그로 기록한다.
  async logScheduledNotifications() {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();

    const summaries = scheduledNotifications.map(
      (notification: ScheduledNotificationSummarySource) => {
        const trigger = notification.trigger;

        return {
          id: notification.identifier,
          title: notification.content.title,
          body: notification.content.body,
          triggerType: trigger?.type,
          weekday: trigger?.weekday,
          hour: trigger?.hour,
          minute: trigger?.minute,
          channelId: trigger?.channelId,
        };
      },
    );

    logger.info(
      `[NOTIFICATION] Scheduled notifications: ${JSON.stringify(summaries)}`,
    );
  },

  // 예약된 모든 로컬 알림을 취소한다.
  async cancelAllScheduledNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  // 주간 반복 로컬 알림을 예약한다.
  async scheduleWeeklyNotification(
    params: IScheduleWeeklyNotificationParams,
  ): Promise<string> {
    try {
      const trigger: Notifications.SchedulableNotificationTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: params.weekday,
        hour: params.hour,
        minute: params.minute,
        channelId: NOTIFICATION_CHANNEL_ID,
      };

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: params.title,
          body: params.body,
          sound: 'default',
          data: sanitizeNotificationData(params.data),
          categoryIdentifier: NOTIFICATION_CATEGORY_REMINDER,
        },
        trigger,
      });

      const nextTriggerDate =
        await Notifications.getNextTriggerDateAsync(trigger);
      logger.info(
        `[NOTIFICATION] reminderId=${params.data?.reminderId ?? 'n/a'} notificationId=${identifier} trigger=${JSON.stringify(trigger)} nextTriggerDate=${nextTriggerDate ?? 'none'} scheduled=true`,
      );

      await this.logScheduledNotifications();
      return identifier;
    } catch (e) {
      logger.error(`[NOTIFICATION-DATASOURCE] Failed to schedule: ${e}`);
      throw e;
    }
  },

  // 일정 시간 뒤 한 번만 다시 알림을 예약한다.
  async scheduleSnoozeNotification(
    params: IScheduleSnoozeNotificationParams,
  ): Promise<string> {
    try {
      const trigger: Notifications.SchedulableNotificationTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: params.seconds,
        repeats: false,
        channelId: NOTIFICATION_CHANNEL_ID,
      };

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: params.title,
          body: params.body,
          sound: 'default',
          data: sanitizeNotificationData(params.data),
          categoryIdentifier: NOTIFICATION_CATEGORY_REMINDER,
        },
        trigger,
      });

      const nextTriggerDate =
        await Notifications.getNextTriggerDateAsync(trigger);
      logger.info(
        `[NOTIFICATION] reminderId=${params.data?.reminderId ?? 'n/a'} notificationId=${identifier} trigger=${JSON.stringify(trigger)} nextTriggerDate=${nextTriggerDate ?? 'none'} scheduled=true`,
      );

      await this.logScheduledNotifications();
      return identifier;
    } catch (e) {
      logger.error(`[NOTIFICATION-DATASOURCE] Failed to schedule snooze: ${e}`);
      throw e;
    }
  },
};
