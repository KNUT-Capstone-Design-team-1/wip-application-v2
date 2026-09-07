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

// 스케줄 예약 오류를 안전하게 문자열/JSON으로 변환
export const describeScheduleError = (error: unknown): string => {
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
// sound: 'default' 문자열을 넘기면 Android 네이티브 SoundResolver가 직렬화 불가능한 android.net.Uri를 생성하므로 생략합니다.
// 소리 및 진동은 setNotificationChannelAsync('pill-reminder') 채널 설정에 의해 자동으로 정상 출력됩니다.
export const buildNotificationContent = (title: string, body: string) => ({
  title,
  body,
  categoryIdentifier: NOTIFICATION_CATEGORY_REMINDER,
});

/**
 * 다음 실행 시각 계산 유틸리티
 * expo-notifications Android의 WeeklyTrigger(DAY_OF_WEEK_IN_MONTH) 버그를 방지하고,
 * 정확한 타임스탬프 기반 DateTrigger 또는 WeeklyTrigger를 생성합니다.
 */
export const calculateNextWeeklyTimestamp = (
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
export const buildWeeklyNotificationRequest = (
  params: IScheduleWeeklyNotificationParams,
) => {
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
export const buildSnoozeNotificationRequest = (
  params: IScheduleSnoozeNotificationParams,
) => ({
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
