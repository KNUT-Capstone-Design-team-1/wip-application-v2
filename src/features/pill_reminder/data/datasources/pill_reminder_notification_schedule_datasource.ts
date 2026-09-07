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

// 스케줄 예약 오류를 문자열로 변환
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

// Android/iOS 공통 안전 알림 콘텐츠 생성
const buildNotificationContent = (title: string, body: string) => ({
  title,
  body,
  sound: 'default' as const,
  categoryIdentifier: NOTIFICATION_CATEGORY_REMINDER,
});

/**
 * 다음 실행 시각 계산 유틸리티
 * expo-notifications Android의 WeeklyTrigger(DAY_OF_WEEK_IN_MONTH) 버그를 방지하고,
 * 정확한 타임스탬프 기반 DateTrigger 또는 WeeklyTrigger를 생성합니다.
 */
const calculateNextWeeklyTimestamp = (
  weekday: number, // 1: 일, 2: 월, ..., 7: 토
  hour: number,
  minute: number,
): number => {
  const now = new Date();
  const target = new Date(now);

  target.setHours(hour, minute, 0, 0);

  // JS getDay(): 0=일, 1=월, ..., 6=토 -> Expo weekday: 1=일, 2=월, ..., 7=토
  const currentExpoWeekday = now.getDay() + 1;
  let dayDifference = weekday - currentExpoWeekday;

  // 이미 오늘 지정 시간이 지났거나 이전 요일인 경우 다음 주 같은 요일로 설정
  if (
    dayDifference < 0 ||
    (dayDifference === 0 && target.getTime() <= now.getTime())
  ) {
    dayDifference += 7;
  }

  target.setDate(now.getDate() + dayDifference);
  return target.getTime();
};

// 주간 반복 알림 요청 객체 생성 (Android에서는 버그 없는 정확한 DateTrigger 사용, iOS는 Native WeeklyTrigger 사용)
const buildWeeklyRequest = (params: IScheduleWeeklyNotificationParams) => {
  const isAndroid = Platform.OS === 'android';

  if (isAndroid) {
    const nextTimestamp = calculateNextWeeklyTimestamp(
      params.weekday,
      params.hour,
      params.minute,
    );

    return {
      content: buildNotificationContent(params.title, params.body),
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: nextTimestamp,
        channelId: NOTIFICATION_CHANNEL_ID,
      } as Notifications.SchedulableNotificationTriggerInput,
    };
  }

  return {
    content: buildNotificationContent(params.title, params.body),
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: params.weekday,
      hour: params.hour,
      minute: params.minute,
    } as Notifications.SchedulableNotificationTriggerInput,
  };
};

// 스누즈(다시 알림) 요청 객체 생성
const buildSnoozeRequest = (params: IScheduleSnoozeNotificationParams) => ({
  content: buildNotificationContent(params.title, params.body),
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

// 실제 OS 알림 스케줄러 등록
const scheduleRequest = async (
  request: ScheduleRequest,
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

  // 스누즈(다시 알림) 예약
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
