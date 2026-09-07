import * as Notifications from 'expo-notifications';
import { pillReminderNotificationRepository } from '@features/pill_reminder/data/repositories/pill_reminder_notification_repository';
import { pillReminderNotificationPermissionService } from '@features/pill_reminder/services/pill_reminder_notification_permission_service';
import {
  describeNotificationError,
  dispatchNotificationResponse,
} from '@features/pill_reminder/utils/reminder_notification_response_helper';
import { rescheduleAllPillReminders } from '@features/pill_reminder/services/pill_reminder_reschedule_service';
import {
  NotificationPermissionState,
  NotificationRescheduleSummary,
} from '@features/pill_reminder/types/pill_reminder_notification_type';
import logger from '@utils/logger';

let responseSubscription: { remove: () => void } | null = null;
let reschedulePromise: Promise<NotificationRescheduleSummary> | null = null;

// 복용 알림 로컬 푸시 및 인앱 알림 통합 비즈니스 서비스
export const pillReminderNotificationService = {
  // 시스템 설정 화면 이동
  openNotificationSettings(): void {
    pillReminderNotificationPermissionService.openNotificationSettings();
  },

  // 알림/정밀 알람 권한 상태를 한 번에 정리해서 조회한다.
  async getNotificationPermissionState(): Promise<NotificationPermissionState> {
    return await pillReminderNotificationPermissionService.getNotificationPermissionState();
  },

  // Android 설정 화면으로 이동해 사용자에게 직접 권한을 허용하게 한다.
  openExactAlarmSettings(): void {
    pillReminderNotificationPermissionService.openExactAlarmSettings();
  },

  // 알림 권한과 Exact Alarm 상태를 확인한 뒤 필요한 경우 안내를 띄운다.
  async initPermissions(showModalIfDenied = true): Promise<boolean> {
    return await pillReminderNotificationPermissionService.initPermissions(
      showModalIfDenied,
    );
  },

  // 최신 권한 상태를 다시 확인해 예약 전 조건을 검증한다.
  async ensurePermissions(): Promise<boolean> {
    return await pillReminderNotificationPermissionService.ensurePermissions();
  },

  // 사용자 알림 액션 응답 처리
  async handleNotificationResponse(
    response: Notifications.NotificationResponse,
  ): Promise<void> {
    await dispatchNotificationResponse(response);
  },

  // Cold Start 알림 응답 소비 유스케이스
  async checkColdStartNotification(): Promise<void> {
    try {
      const lastResponse =
        await pillReminderNotificationRepository.getLastNotificationResponse();

      const hasColdStartResponse = Boolean(lastResponse);

      if (!hasColdStartResponse || !lastResponse) {
        return;
      }

      await this.handleNotificationResponse(lastResponse);
    } catch (e) {
      logger.error(
        `[NOTIFICATION-SERVICE] Failed to check cold start notification: ${e}`,
      );
    }
  },

  // 저장된 복용 알림을 OS의 반복 알림으로 다시 등록한다.
  async rescheduleAllNotifications(): Promise<NotificationRescheduleSummary> {
    if (reschedulePromise) {
      return await reschedulePromise;
    }

    const currentReschedule = this.rescheduleAllNotificationsInternal();
    reschedulePromise = currentReschedule;

    try {
      return await currentReschedule;
    } finally {
      if (reschedulePromise === currentReschedule) {
        reschedulePromise = null;
      }
    }
  },

  // 내부 재등록 유스케이스
  async rescheduleAllNotificationsInternal(): Promise<NotificationRescheduleSummary> {
    return await rescheduleAllPillReminders();
  },

  // 알림 감시 시작
  startWatcher(): void {
    const hasNoSubscription = !responseSubscription;

    if (hasNoSubscription) {
      responseSubscription =
        pillReminderNotificationRepository.addNotificationResponseListener(
          (response) => {
            void this.handleNotificationResponse(response);
          },
        );
    }

    void this.checkColdStartNotification();
    void this.rescheduleAllNotifications();
  },

  // 알림 감시 중지 및 리스너 해제
  stopWatcher(): void {
    const hasSubscription = Boolean(responseSubscription);

    if (!hasSubscription || !responseSubscription) {
      return;
    }

    responseSubscription.remove();
    responseSubscription = null;
  },
};
