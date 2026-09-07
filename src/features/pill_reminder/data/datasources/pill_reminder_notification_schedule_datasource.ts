import * as Notifications from 'expo-notifications';
import {
  IScheduleSnoozeNotificationParams,
  IScheduleWeeklyNotificationParams,
} from '@features/pill_reminder/types/pill_reminder_data_type';
import {
  ScheduledNotificationSummarySource,
  ScheduleNotificationRequest,
} from '@features/pill_reminder/types/pill_reminder_notification_type';
import {
  describeScheduleError,
  buildWeeklyNotificationRequest,
  buildSnoozeNotificationRequest,
} from '@features/pill_reminder/utils/reminder_notification_trigger_helper';
import logger from '@utils/logger';

// 실제 OS 알림 스케줄러 등록
const scheduleRequest = async (
  request: ScheduleNotificationRequest,
  reminderId: number,
): Promise<string> => {
  const identifier = await Notifications.scheduleNotificationAsync(request);
  let nextTriggerDate: number | null = null;

  try {
    nextTriggerDate = await Notifications.getNextTriggerDateAsync(
      request.trigger,
    );
  } catch (error) {
    logger.warn(
      `[NOTIFICATION] Failed to verify next trigger reminderId=${reminderId} error=${describeScheduleError(error)}`,
    );
  }

  logger.info(
    `[NOTIFICATION] reminderId=${reminderId} notificationId=${identifier} trigger=${JSON.stringify(request.trigger)} nextTriggerDate=${nextTriggerDate ?? 'none'} scheduled=true`,
  );

  return identifier;
};

// OS에 등록된 예약 알림 목록 로깅
const logScheduledNotifications = async (): Promise<void> => {
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
};

export const pillReminderNotificationScheduleDataSource = {
  // 실제 OS에 등록된 예약 알림 목록 로깅
  async logScheduledNotifications() {
    await logScheduledNotifications();
  },

  // 모든 예약 알림 취소
  async cancelAllScheduledNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  // 주간 반복 알림 예약
  async scheduleWeeklyNotification(
    params: IScheduleWeeklyNotificationParams,
  ): Promise<string> {
    const request = buildWeeklyNotificationRequest(params);

    try {
      return await scheduleRequest(request, params.data.reminderId);
    } catch (e) {
      logger.error(
        `[NOTIFICATION-DATASOURCE] Failed to schedule reminderId=${params.data?.reminderId ?? 'n/a'} error=${describeScheduleError(e)} request=${JSON.stringify(
          request,
        )}`,
      );
      throw e;
    }
  },

  // 스누즈(다시 알림) 예약
  async scheduleSnoozeNotification(
    params: IScheduleSnoozeNotificationParams,
  ): Promise<string> {
    const request = buildSnoozeNotificationRequest(params);

    try {
      return await scheduleRequest(request, params.data.reminderId);
    } catch (e) {
      logger.error(
        `[NOTIFICATION-DATASOURCE] Failed to schedule snooze reminderId=${params.data?.reminderId ?? 'n/a'} error=${describeScheduleError(e)} request=${JSON.stringify(
          request,
        )}`,
      );
      throw e;
    }
  },
};
