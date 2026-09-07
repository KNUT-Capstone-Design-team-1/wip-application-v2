import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
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

const describeScheduleError = (error: unknown): string => {
  if (error instanceof Error) {
    const details = Object.getOwnPropertyNames(error).reduce<
      Record<string, unknown>
    >((result, key) => {
      result[key] = (error as unknown as Record<string, unknown>)[key];
      return result;
    }, {});

    return JSON.stringify({
      name: error.name,
      message: error.message,
      ...details,
    });
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};

// 알림 콘텐츠를 Android가 읽을 수 있는 값으로 만든다.
const buildNotificationContent = (
  title: string,
  body: string,
  data: { reminderId: number },
) => ({
  title,
  body,
  sound: 'default' as const,
  data: sanitizeNotificationData(data),
  categoryIdentifier: NOTIFICATION_CATEGORY_REMINDER,
});

// 주간 반복 예약 요청을 만든다.
const buildWeeklyRequest = (params: IScheduleWeeklyNotificationParams) => ({
  content: buildNotificationContent(params.title, params.body, params.data),
  trigger: {
    type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
    weekday: params.weekday,
    hour: params.hour,
    minute: params.minute,
    ...(Platform.OS === 'android'
      ? { channelId: NOTIFICATION_CHANNEL_ID }
      : {}),
  } as Notifications.SchedulableNotificationTriggerInput,
});

// 일회성 다시 알림 예약 요청을 만든다.
const buildSnoozeRequest = (params: IScheduleSnoozeNotificationParams) => ({
  content: buildNotificationContent(params.title, params.body, params.data),
  trigger: {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: params.seconds,
    repeats: false,
    ...(Platform.OS === 'android'
      ? { channelId: NOTIFICATION_CHANNEL_ID }
      : {}),
  } as Notifications.SchedulableNotificationTriggerInput,
});

type ScheduleRequest = Omit<
  Parameters<typeof Notifications.scheduleNotificationAsync>[0],
  'trigger'
> & {
  trigger: Notifications.SchedulableNotificationTriggerInput;
};

// 등록 후 다음 실행 시각과 OS 등록 목록을 확인한다.
const scheduleRequest = async (
  request: ScheduleRequest,
  reminderId: number,
): Promise<string> => {
  const identifier = await Notifications.scheduleNotificationAsync(request);
  let nextTriggerDate: number | null = null;

  // 다음 실행 시각 조회 실패가 예약 실패로 이어지지 않게 한다.
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

  // OS 목록 조회 실패가 예약 실패로 이어지지 않게 한다.
  try {
    await logScheduledNotifications();
  } catch (error) {
    logger.warn(
      `[NOTIFICATION] Failed to verify scheduled notifications reminderId=${reminderId} error=${describeScheduleError(error)}`,
    );
  }

  return identifier;
};

// OS에 등록된 예약 알림을 로그로 확인한다.
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

// 예약 알림과 예약 목록 로그를 담당한다.
export const pillReminderNotificationScheduleDataSource = {
  // 실제 OS에 등록된 예약 알림 목록을 로그로 기록한다.
  async logScheduledNotifications() {
    await logScheduledNotifications();
  },

  // 예약된 모든 로컬 알림을 취소한다.
  async cancelAllScheduledNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  // 주간 반복 로컬 알림을 예약한다.
  async scheduleWeeklyNotification(
    params: IScheduleWeeklyNotificationParams,
  ): Promise<string> {
    const request = buildWeeklyRequest(params);

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

  // 일정 시간 뒤 한 번만 다시 알림을 예약한다.
  async scheduleSnoozeNotification(
    params: IScheduleSnoozeNotificationParams,
  ): Promise<string> {
    const request = buildSnoozeRequest(params);

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
