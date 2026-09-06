import * as Notifications from 'expo-notifications';
import { pillReminderNotificationDataSource } from '@features/pill_reminder/data/datasources/pill_reminder_notification_datasource';
import {
  IScheduleWeeklyNotificationParams,
  IScheduleSnoozeNotificationParams,
} from '@features/pill_reminder/types/pill_reminder_data_type';

// 복용 알림 시스템/기기 알림 리포지토리
export const pillReminderNotificationRepository = {
  // 권한 조회
  async getPermissions(): Promise<Notifications.PermissionResponse> {
    return await pillReminderNotificationDataSource.getPermissions();
  },

  // 권한 요청
  async requestPermissions(): Promise<Notifications.PermissionResponse> {
    return await pillReminderNotificationDataSource.requestPermissions();
  },

  // 채널 설정
  async setNotificationChannel(): Promise<void> {
    await pillReminderNotificationDataSource.setNotificationChannel();
  },

  // 전체 스케줄 취소
  async cancelAllScheduledNotifications(): Promise<void> {
    await pillReminderNotificationDataSource.cancelAllScheduledNotifications();
  },

  // 주간 반복 알림 스케줄 등록
  async scheduleWeeklyNotification(
    params: IScheduleWeeklyNotificationParams,
  ): Promise<string> {
    return await pillReminderNotificationDataSource.scheduleWeeklyNotification(
      params,
    );
  },

  // 스누즈(다시 알림) 스케줄 등록
  async scheduleSnoozeNotification(
    params: IScheduleSnoozeNotificationParams,
  ): Promise<string> {
    return await pillReminderNotificationDataSource.scheduleSnoozeNotification(
      params,
    );
  },

  // 알림 응답(사용자 액션 클릭) 리스너 등록
  addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void,
  ) {
    return pillReminderNotificationDataSource.addNotificationResponseListener(
      listener,
    );
  },

  // 진동 트리거
  triggerVibration(): void {
    pillReminderNotificationDataSource.triggerVibration();
  },
};
