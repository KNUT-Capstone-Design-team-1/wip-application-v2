import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';
import { pillReminderNotificationRepository } from '@features/pill_reminder/data/repositories/pill_reminder_notification_repository';
import { pillReminderQueryService } from '@features/pill_reminder/services/pill_reminder_query_service';
import {
  DEFAULT_NOTIFICATION_TITLE,
  NOTIFICATION_TOAST_VISIBILITY_MS,
  NOTIFICATION_ACTION_CONFIRM,
  NOTIFICATION_ACTION_SNOOZE,
  NOTIFICATION_ACTION_DISMISS,
  SNOOZE_DELAY_SECONDS,
} from '@features/pill_reminder/constants/reminder_notification_constant';
import { useCommonModalStore } from '@store/common_modal_store';
import Toast from 'react-native-toast-message';
import logger from '@utils/logger';

let responseSubscription: { remove: () => void } | null = null;

// 복용 알림 로컬 푸시 및 인앱 알림 통합 비즈니스 서비스
export const pillReminderNotificationService = {
  // 시스템 설정 화면 이동
  openNotificationSettings(): void {
    if (Platform.OS === 'ios') {
      void Linking.openURL('app-settings:');
    } else {
      void Linking.openSettings();
    }
  },

  // 시스템 알림 채널 및 권한 초기화/요청 유스케이스 (거부 시 설정 이동 모달 팝업)
  async initPermissions(showModalIfDenied = true): Promise<boolean> {
    try {
      const existingStatus =
        await pillReminderNotificationRepository.getPermissions();
      let finalStatus = existingStatus.status;

      // 권한이 없거나 canAskAgain 가능한 경우 즉시 시스템 다이얼로그 요청
      if (finalStatus !== 'granted') {
        const statusResponse =
          await pillReminderNotificationRepository.requestPermissions();
        finalStatus = statusResponse.status;
      }

      // 채널 설정
      await pillReminderNotificationRepository.setNotificationChannel();

      const isGranted = finalStatus === 'granted';

      if (!isGranted && showModalIfDenied) {
        useCommonModalStore.getState().showModal({
          title: '알림 권한 필요',
          message:
            '복용 시간에 맞춰 알림을 받으시려면\n기기 설정에서 알림 권한을 허용해주세요.',
          confirmText: '설정으로 이동',
          cancelText: '닫기',
          onConfirm: () => {
            this.openNotificationSettings();
          },
        });
      }

      return isGranted;
    } catch (e) {
      logger.error(`[NOTIFICATION-SERVICE] Failed to init permissions: ${e}`);
      return false;
    }
  },

  // 권한 상태 확인 (캐싱 없이 실시간 확인)
  async ensurePermissions(): Promise<boolean> {
    const status = await pillReminderNotificationRepository.getPermissions();
    if (status.status === 'granted') {
      return true;
    }
    return await this.initPermissions(false);
  },

  // 사용자 알림 액션 응답 처리 (복용 완료 / 5분 뒤 다시 알림 / 끄기)
  async handleNotificationResponse(
    response: Notifications.NotificationResponse,
  ): Promise<void> {
    try {
      const actionId = response.actionIdentifier;
      const notificationData = response.notification.request.content.data as {
        reminderId?: number;
      };
      const reminderId = notificationData?.reminderId;

      logger.info(
        `[NOTIFICATION-SERVICE] Notification action received: ${actionId}, reminderId: ${reminderId}`,
      );

      if (actionId === NOTIFICATION_ACTION_CONFIRM) {
        // 복용 완료 처리
        Toast.show({
          type: 'default',
          text1: '복용 완료 처리되었어요.',
          visibilityTime: NOTIFICATION_TOAST_VISIBILITY_MS,
        });
      } else if (actionId === NOTIFICATION_ACTION_SNOOZE && reminderId) {
        // 5분 뒤 다시 알림 스케줄 등록
        const reminder =
          await pillReminderQueryService.getReminderById(reminderId);
        const title = reminder?.title || DEFAULT_NOTIFICATION_TITLE;
        const body = `[다시 알림] ${reminder?.items.map((i) => i.item_name).join(', ') || '약'} 복용할 시간이에요!`;

        await pillReminderNotificationRepository.scheduleSnoozeNotification({
          title: `[${title}]`,
          body,
          seconds: SNOOZE_DELAY_SECONDS,
          data: { reminderId },
        });

        Toast.show({
          type: 'default',
          text1: '5분 뒤 다시 알림이 설정되었습니다.',
          visibilityTime: NOTIFICATION_TOAST_VISIBILITY_MS,
        });
      } else if (actionId === NOTIFICATION_ACTION_DISMISS) {
        logger.info(
          `[NOTIFICATION-SERVICE] Reminder dismissed for ID: ${reminderId}`,
        );
      }
    } catch (e) {
      logger.error(
        `[NOTIFICATION-SERVICE] Failed to handle notification response: ${e}`,
      );
    }
  },

  /**
   * 저장된 복용 알림을 OS의 반복 알림으로 다시 등록한다.
   * 등록된 모든 활성 복용 알림을 OS 시스템 스케줄러에 등록 유스케이스 (앱 종료 시에도 작동)
   */
  async rescheduleAllNotifications(): Promise<void> {
    try {
      const hasPermission = await this.ensurePermissions();

      if (!hasPermission) {
        return;
      }

      // 기존 스케줄된 모든 로컬 알림 취소
      await pillReminderNotificationRepository.cancelAllScheduledNotifications();

      const reminders = await pillReminderQueryService.getReminders();

      const activeReminders = reminders.filter((r) => r.is_enabled);

      for (const reminder of activeReminders) {
        const [hourStr, minuteStr] = reminder.time.split(':');
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);

        const itemCount = reminder.items.length;
        let pillBody = '복용할 시간이에요!';

        if (itemCount === 1) {
          const first = reminder.items[0];
          pillBody = `${first.item_name} ${first.dosage}정 복용할 시간이에요!`;
        } else if (itemCount > 1) {
          const first = reminder.items[0];
          pillBody = `${first.item_name} 외 ${itemCount - 1}개 복용할 시간이에요!`;
        }

        const hasMemo = Boolean(reminder.memo);
        const finalBody = hasMemo
          ? `${pillBody}\n메모: ${reminder.memo}`
          : pillBody;

        const reminderTitle = reminder.title || DEFAULT_NOTIFICATION_TITLE;

        // 각 요일별 주간 반복 알림 스케줄 등록
        for (const day of reminder.days) {
          // JS day(0: 일, 1: 월... 6: 토) -> Expo weekday(1: 일, 2: 월... 7: 토)
          const expoWeekday = day === 0 ? 1 : day + 1;

          await pillReminderNotificationRepository.scheduleWeeklyNotification({
            title: `[${reminderTitle}]`,
            body: finalBody,
            weekday: expoWeekday,
            hour,
            minute,
            data: { reminderId: reminder.id },
          });
        }
      }
    } catch (e) {
      logger.error(
        `[NOTIFICATION-SERVICE] Failed to reschedule notifications: ${e}`,
      );
    }
  },

  // 알림 감시 시작: 사용자 액션 응답 리스너 구독 및 시스템 알림 스케줄 동기화
  startWatcher(): void {
    // 알림 응답(사용자 액션 클릭) 리스너 구독
    if (!responseSubscription) {
      responseSubscription =
        pillReminderNotificationRepository.addNotificationResponseListener(
          (response) => {
            void this.handleNotificationResponse(response);
          },
        );
    }

    void this.rescheduleAllNotifications();
  },

  // 알림 감시 중지 및 리스너 해제
  stopWatcher(): void {
    if (responseSubscription) {
      responseSubscription.remove();
      responseSubscription = null;
    }
  },
};
