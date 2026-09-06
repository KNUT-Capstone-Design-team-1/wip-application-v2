import { Platform, Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';
import {
  NOTIFICATION_CHANNEL_ID,
  NOTIFICATION_CHANNEL_NAME,
  NOTIFICATION_LIGHT_COLOR,
  NOTIFICATION_CATEGORY_REMINDER,
  NOTIFICATION_ACTION_CONFIRM,
  NOTIFICATION_ACTION_SNOOZE,
  NOTIFICATION_ACTION_DISMISS,
  CHANNEL_VIBRATION_PATTERN,
  ALARM_VIBRATION_PATTERN,
} from '@features/pill_reminder/constants/reminder_notification_constant';
import {
  IScheduleWeeklyNotificationParams,
  IScheduleSnoozeNotificationParams,
} from '@features/pill_reminder/types/pill_reminder_data_type';
import logger from '@utils/logger';

// 포그라운드 알림 수신 동작 기본 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Expo Notifications 및 Vibration 기반 알림 데이터 소스 구현체
export const pillReminderNotificationDataSource = {
  // 알림 권한 상태 조회
  async getPermissions() {
    return await Notifications.getPermissionsAsync();
  },

  // 알림 권한 요청
  async requestPermissions() {
    return await Notifications.requestPermissionsAsync();
  },

  // Android 알림 채널 및 인터랙티브 알림 카테고리(iOS/Android 공통) 설정
  async setNotificationChannel() {
    try {
      // 1. 대화형 알림 카테고리 등록 (iOS/Android 공통 액션 버튼)
      await Notifications.setNotificationCategoryAsync(
        NOTIFICATION_CATEGORY_REMINDER,
        [
          {
            identifier: NOTIFICATION_ACTION_CONFIRM,
            buttonTitle: '💊 복용 완료',
            options: {
              opensAppToForeground: false,
            },
          },
          {
            identifier: NOTIFICATION_ACTION_SNOOZE,
            buttonTitle: '⏰ 5분 뒤 다시 알림',
            options: {
              opensAppToForeground: false,
            },
          },
          {
            identifier: NOTIFICATION_ACTION_DISMISS,
            buttonTitle: '✕ 끄기',
            options: {
              isDestructive: true,
              opensAppToForeground: false,
            },
          },
        ],
      );

      // 2. Android 알림 채널 최고 중요도(MAX/헤드업) 설정
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(
          NOTIFICATION_CHANNEL_ID,
          {
            name: NOTIFICATION_CHANNEL_NAME,
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: CHANNEL_VIBRATION_PATTERN,
            lightColor: NOTIFICATION_LIGHT_COLOR,
            sound: 'default',
            enableVibrate: true,
            showBadge: true,
            lockscreenVisibility:
              Notifications.AndroidNotificationVisibility.PUBLIC,
            bypassDnd: false,
          },
        );
      }
    } catch (e) {
      logger.error(
        `[NOTIFICATION-DATASOURCE] Failed to set channel or categories: ${e}`,
      );
    }
  },

  // 스케줄된 모든 로컬 알림 취소
  async cancelAllScheduledNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  // 주간 반복 로컬 푸시 알림 등록
  async scheduleWeeklyNotification(
    params: IScheduleWeeklyNotificationParams,
  ): Promise<string> {
    try {
      return await Notifications.scheduleNotificationAsync({
        content: {
          title: params.title,
          body: params.body,
          sound: 'default',
          data: params.data,
          categoryIdentifier: NOTIFICATION_CATEGORY_REMINDER,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: params.weekday,
          hour: params.hour,
          minute: params.minute,
          channelId: NOTIFICATION_CHANNEL_ID,
        },
      });
    } catch (e) {
      logger.error(`[NOTIFICATION-DATASOURCE] Failed to schedule: ${e}`);
      throw e;
    }
  },

  // 스누즈(5분 뒤 다시 알림) 스케줄 등록
  async scheduleSnoozeNotification(
    params: IScheduleSnoozeNotificationParams,
  ): Promise<string> {
    try {
      return await Notifications.scheduleNotificationAsync({
        content: {
          title: params.title,
          body: params.body,
          sound: 'default',
          data: params.data,
          categoryIdentifier: NOTIFICATION_CATEGORY_REMINDER,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: params.seconds,
          repeats: false,
          channelId: NOTIFICATION_CHANNEL_ID,
        },
      });
    } catch (e) {
      logger.error(`[NOTIFICATION-DATASOURCE] Failed to schedule snooze: ${e}`);
      throw e;
    }
  },

  // 알림 응답(사용자 액션 클릭) 리스너 등록
  addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void,
  ) {
    return Notifications.addNotificationResponseReceivedListener(listener);
  },

  // 알람 진동 패턴 실행
  triggerVibration() {
    try {
      Vibration.vibrate(ALARM_VIBRATION_PATTERN, false);
    } catch (e) {
      logger.error(`[NOTIFICATION-DATASOURCE] Failed to vibrate: ${e}`);
    }
  },
};
