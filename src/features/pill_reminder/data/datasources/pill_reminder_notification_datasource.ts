import * as Notifications from 'expo-notifications';
import {
  IScheduleSnoozeNotificationParams,
  IScheduleWeeklyNotificationParams,
} from '@features/pill_reminder/types/pill_reminder_data_type';
import { pillReminderNotificationChannelDataSource } from '@features/pill_reminder/data/datasources/pill_reminder_notification_channel_datasource';
import { pillReminderNotificationPermissionDataSource } from '@features/pill_reminder/data/datasources/pill_reminder_notification_permission_datasource';
import { pillReminderNotificationScheduleDataSource } from '@features/pill_reminder/data/datasources/pill_reminder_notification_schedule_datasource';

// 포그라운드 알림 수신 동작 기본 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// 기존 repository API를 유지하면서 기능별 데이터소스를 연결한다.
export const pillReminderNotificationDataSource = {
  // 앱 실행 시 마지막 알림 응답을 조회한다.
  async getLastNotificationResponse() {
    return await pillReminderNotificationPermissionDataSource.getLastNotificationResponse();
  },

  // 알림 권한 상태를 조회한다.
  async getPermissions() {
    return await pillReminderNotificationPermissionDataSource.getPermissions();
  },

  // Android 정확한 알람 권한 상태를 조회한다.
  async getExactAlarmPermissionStatus(): Promise<boolean> {
    return await pillReminderNotificationPermissionDataSource.getExactAlarmPermissionStatus();
  },

  // 일반 알림과 정확한 알람 권한을 분리해서 조회한다.
  async getNotificationPermissionState() {
    return await pillReminderNotificationPermissionDataSource.getNotificationPermissionState();
  },

  // 알림 권한을 요청한다.
  async requestPermissions() {
    return await pillReminderNotificationPermissionDataSource.requestPermissions();
  },

  // 실제 OS에 등록된 예약 알림 목록을 로그로 기록한다.
  async logScheduledNotifications() {
    await pillReminderNotificationScheduleDataSource.logScheduledNotifications();
  },

  // Android 채널과 알림 액션 카테고리를 설정한다.
  async setNotificationChannel() {
    await pillReminderNotificationChannelDataSource.setNotificationChannel();
  },

  // 예약된 모든 로컬 알림을 취소한다.
  async cancelAllScheduledNotifications() {
    await pillReminderNotificationScheduleDataSource.cancelAllScheduledNotifications();
  },

  // 주간 반복 로컬 알림을 예약한다.
  async scheduleWeeklyNotification(
    params: IScheduleWeeklyNotificationParams,
  ): Promise<string> {
    return await pillReminderNotificationScheduleDataSource.scheduleWeeklyNotification(
      params,
    );
  },

  // 일정 시간 뒤 한 번만 다시 알림을 예약한다.
  async scheduleSnoozeNotification(
    params: IScheduleSnoozeNotificationParams,
  ): Promise<string> {
    return await pillReminderNotificationScheduleDataSource.scheduleSnoozeNotification(
      params,
    );
  },

  // 알림 응답 리스너를 등록한다.
  addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void,
  ) {
    return Notifications.addNotificationResponseReceivedListener(listener);
  },
};
