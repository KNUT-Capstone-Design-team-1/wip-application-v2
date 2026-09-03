import * as Notifications from 'expo-notifications';
import {
  IPillReminderNotificationDataSource,
  pillReminderNotificationDataSource,
} from '@features/pill_reminder/data/datasources/pill_reminder_notification_datasource';

// 복용 알림 시스템/기기 알림 리포지토리 인터페이스
export interface IPillReminderNotificationRepository {
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

// 복용 알림 시스템/기기 알림 리포지토리 구현체
export class PillReminderNotificationRepository implements IPillReminderNotificationRepository {
  constructor(
    private readonly dataSource: IPillReminderNotificationDataSource = pillReminderNotificationDataSource,
  ) {}

  // 권한 조회
  async getPermissions() {
    return await this.dataSource.getPermissions();
  }

  // 권한 요청
  async requestPermissions() {
    return await this.dataSource.requestPermissions();
  }

  // 채널 설정
  async setNotificationChannel() {
    await this.dataSource.setNotificationChannel();
  }

  // 전체 스케줄 취소
  async cancelAllScheduledNotifications() {
    await this.dataSource.cancelAllScheduledNotifications();
  }

  // 주간 반복 알림 스케줄 등록
  async scheduleWeeklyNotification(params: {
    title: string;
    body: string;
    weekday: number;
    hour: number;
    minute: number;
    data: { reminderId: number };
  }) {
    return await this.dataSource.scheduleWeeklyNotification(params);
  }

  // 진동 트리거
  triggerVibration() {
    this.dataSource.triggerVibration();
  }
}

// 복용 알림 알림 리포지토리 싱글톤 인스턴스
export const pillReminderNotificationRepository =
  new PillReminderNotificationRepository();
