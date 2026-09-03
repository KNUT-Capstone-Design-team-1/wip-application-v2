import { Platform, Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';
import {
  NOTIFICATION_CHANNEL_ID,
  NOTIFICATION_CHANNEL_NAME,
  NOTIFICATION_LIGHT_COLOR,
  CHANNEL_VIBRATION_PATTERN,
  ALARM_VIBRATION_PATTERN,
} from '@features/pill_reminder/constants/reminder_notification_constant';
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

// 알림 및 진동 기기 I/O 데이터 소스 인터페이스
export interface IPillReminderNotificationDataSource {
  getPermissions(): Promise<Notifications.PermissionResponse>;
  requestPermissions(): Promise<Notifications.PermissionResponse>;
  setNotificationChannel(): Promise<void>;
  cancelAllScheduledNotifications(): Promise<void>;
  scheduleWeeklyNotification(params: {
    title: string;
    body: string;
    weekday: number;
    hour: number;
    minute: number;
    data: { reminderId: number };
  }): Promise<string>;
  triggerVibration(): void;
}

// Expo Notifications 및 Vibration 기반 알림 데이터 소스 구현체
export const pillReminderNotificationDataSource: IPillReminderNotificationDataSource =
  {
    // 알림 권한 상태 조회
    async getPermissions() {
      return await Notifications.getPermissionsAsync();
    },

    // 알림 권한 요청
    async requestPermissions() {
      return await Notifications.requestPermissionsAsync();
    },

    // Android 알림 채널 설정
    async setNotificationChannel() {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(
          NOTIFICATION_CHANNEL_ID,
          {
            name: NOTIFICATION_CHANNEL_NAME,
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: CHANNEL_VIBRATION_PATTERN,
            lightColor: NOTIFICATION_LIGHT_COLOR,
            sound: 'default',
          },
        );
      }
    },

    // 스케줄된 모든 로컬 알림 취소
    async cancelAllScheduledNotifications() {
      await Notifications.cancelAllScheduledNotificationsAsync();
    },

    // 주간 반복 로컬 푸시 알림 등록
    async scheduleWeeklyNotification(params) {
      try {
        return await Notifications.scheduleNotificationAsync({
          content: {
            title: params.title,
            body: params.body,
            sound: 'default',
            data: params.data,
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

    // 알람 진동 패턴 실행
    triggerVibration() {
      try {
        Vibration.vibrate(ALARM_VIBRATION_PATTERN, false);
      } catch (e) {
        logger.error(`[NOTIFICATION-DATASOURCE] Failed to vibrate: ${e}`);
      }
    },
  };
