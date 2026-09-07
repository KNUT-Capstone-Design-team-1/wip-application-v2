import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';
import { router } from 'expo-router';
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
import {
  NotificationPermissionState,
  NotificationRescheduleSummary,
} from '@features/pill_reminder/types/pill_reminder_notification_type';

let responseSubscription: { remove: () => void } | null = null;
let reschedulePromise: Promise<NotificationRescheduleSummary> | null = null;

// 복용 알림 로컬 푸시 및 인앱 알림 통합 비즈니스 서비스
export const pillReminderNotificationService = {
  // 시스템 설정 화면 이동
  openNotificationSettings(): void {
    const isIos = Platform.OS === 'ios';

    if (isIos) {
      void Linking.openURL('app-settings:');
      return;
    }

    void Linking.openSettings();
  },

  // 알림/정밀 알람 권한 상태를 한 번에 정리해서 조회한다.
  async getNotificationPermissionState(): Promise<NotificationPermissionState> {
    return await pillReminderNotificationRepository.getNotificationPermissionState();
  },

  // Android 설정 화면으로 이동해 사용자에게 직접 권한을 허용하게 한다.
  openExactAlarmSettings(): void {
    if (Platform.OS !== 'android') {
      this.openNotificationSettings();
      return;
    }

    void Linking.openSettings();
  },

  // 알림 권한과 Exact Alarm 상태를 확인한 뒤 필요한 경우 안내를 띄운다.
  async initPermissions(showModalIfDenied = true): Promise<boolean> {
    try {
      // Android 13+ permission prompts require the channel to exist first.
      await pillReminderNotificationRepository.setNotificationChannel();

      const existingStatus =
        await pillReminderNotificationRepository.getPermissions();
      let finalStatus = existingStatus.status;

      const isPermissionNotGranted = finalStatus !== 'granted';

      if (isPermissionNotGranted && existingStatus.canAskAgain) {
        const statusResponse =
          await pillReminderNotificationRepository.requestPermissions();
        finalStatus = statusResponse.status;
      }

      const notificationGranted = finalStatus === 'granted';
      const exactAlarmState = await this.getNotificationPermissionState();
      const exactAlarmGranted =
        Platform.OS === 'android'
          ? exactAlarmState.exactAlarmGranted
          : undefined;
      const isExactAlarmAllowed =
        Platform.OS !== 'android' || exactAlarmGranted !== false;
      const isGranted = notificationGranted && isExactAlarmAllowed;

      if (!notificationGranted) {
        logger.warn(
          `[NOTIFICATION-SERVICE] Notifications are not granted: ${finalStatus}, canAskAgain=${existingStatus.canAskAgain}`,
        );
      }

      if (Platform.OS === 'android' && exactAlarmGranted === false) {
        logger.warn(
          '[NOTIFICATION-SERVICE] Exact alarm permission is not granted. The system may defer precise medication reminders.',
        );
      }

      const shouldShowDeniedModal = !isGranted && showModalIfDenied;

      if (shouldShowDeniedModal) {
        useCommonModalStore.getState().showModal({
          title:
            Platform.OS === 'android'
              ? '정확한 알림 권한 필요'
              : '알림 권한 필요',
          message:
            Platform.OS === 'android'
              ? '정확한 시간에 약 복용 알림을 받으려면\n기기 설정에서 알람 및 리마인더 권한을 허용해주세요.'
              : '복용 시간에 맞춰 알림을 받으시려면\n기기 설정에서 알림 권한을 허용해주세요.',
          confirmText: '설정으로 이동',
          cancelText: '닫기',
          onConfirm: () => {
            if (Platform.OS === 'android') {
              this.openExactAlarmSettings();
              return;
            }
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

  // 최신 권한 상태를 다시 확인해 예약 전 조건을 검증한다.
  async ensurePermissions(): Promise<boolean> {
    // 권한 확인 전에 Android 채널을 먼저 보장
    await pillReminderNotificationRepository.setNotificationChannel();

    const permissionState = await this.getNotificationPermissionState();
    const isGranted = permissionState.notificationGranted;
    const isExactAlarmAllowed =
      Platform.OS !== 'android' || permissionState.exactAlarmGranted !== false;

    if (isGranted && isExactAlarmAllowed) {
      return true;
    }

    return await this.initPermissions(false);
  },

  // 사용자 알림 액션 응답 처리 (본체 탭: 복용 알림 목록 또는 수정화면 이동 / 액션: 복용 완료 / 5분 뒤 다시 알림 / 끄기)
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

      const isDefaultTap = actionId === Notifications.DEFAULT_ACTION_IDENTIFIER;

      // 알림 본체(기본 탭)를 클릭하여 앱에 진입한 경우
      if (isDefaultTap) {
        const hasReminderId = Boolean(reminderId);

        if (hasReminderId && reminderId) {
          router.push({
            pathname: '/pill-reminder-setting',
            params: { reminderId: reminderId.toString() },
          });
          return;
        }

        router.push('/pill-reminder');
        return;
      }

      const isConfirmAction = actionId === NOTIFICATION_ACTION_CONFIRM;
      if (isConfirmAction) {
        // 복용 완료 처리
        Toast.show({
          type: 'default',
          text1: '복용 완료 처리되었어요.',
          visibilityTime: NOTIFICATION_TOAST_VISIBILITY_MS,
        });
        return;
      }

      const isSnoozeAction =
        actionId === NOTIFICATION_ACTION_SNOOZE && Boolean(reminderId);
      if (isSnoozeAction && reminderId) {
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
        return;
      }

      const isDismissAction = actionId === NOTIFICATION_ACTION_DISMISS;
      if (isDismissAction) {
        logger.info(
          `[NOTIFICATION-SERVICE] Reminder dismissed for ID: ${reminderId}`,
        );
        return;
      }
    } catch (e) {
      logger.error(
        `[NOTIFICATION-SERVICE] Failed to handle notification response: ${e}`,
      );
    }
  },

  // Cold Start(앱 완전 종료 상태에서 알림 클릭으로 켜졌을 때) 알림 응답 소비 유스케이스
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

  /**
   * 저장된 복용 알림을 OS의 반복 알림으로 다시 등록한다.
   * 등록된 모든 활성 복용 알림을 OS 시스템 스케줄러에 등록 유스케이스 (앱 종료 시에도 작동)
   */
  // 저장된 약 알림을 다시 OS에 재등록하고 결과를 요약한다.
  async rescheduleAllNotifications(): Promise<NotificationRescheduleSummary> {
    // 앱 시작과 CRUD 재등록 요청이 동시에 실행되지 않도록 직렬화
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

  // 개별 실패가 전체 재등록을 멈추지 않도록 안전하게 재등록한다.
  async rescheduleAllNotificationsInternal(): Promise<NotificationRescheduleSummary> {
    const summary: NotificationRescheduleSummary = {
      total: 0,
      success: 0,
      failed: 0,
      failures: [],
    };

    try {
      const hasPermission = await this.ensurePermissions();

      if (!hasPermission) {
        return summary;
      }

      // 기존 스케줄된 모든 로컬 알림 취소
      await pillReminderNotificationRepository.cancelAllScheduledNotifications();
      await pillReminderNotificationRepository.logScheduledNotifications();

      const reminders = await pillReminderQueryService.getReminders();
      const activeReminders = reminders.filter((r) => r.is_enabled);

      for (const reminder of activeReminders) {
        const reminderTimes =
          reminder.times && reminder.times.length > 0
            ? reminder.times
            : [reminder.time];

        const itemCount = reminder.items.length;
        let pillBody = '복용할 시간이에요!';

        const isSingleItem = itemCount === 1;
        const isMultipleItems = itemCount > 1;

        if (isSingleItem) {
          const first = reminder.items[0];
          pillBody = `${first.item_name} ${first.dosage}정 복용할 시간이에요!`;
        } else if (isMultipleItems) {
          const first = reminder.items[0];
          pillBody = `${first.item_name} 외 ${itemCount - 1}개 복용할 시간이에요!`;
        }

        const hasMemo = Boolean(reminder.memo);
        const finalBody = hasMemo
          ? `${pillBody}\n메모: ${reminder.memo}`
          : pillBody;

        const reminderTitle = reminder.title || DEFAULT_NOTIFICATION_TITLE;

        for (const timeStr of reminderTimes) {
          const [hourStr, minuteStr] = timeStr.split(':');
          const hour = parseInt(hourStr, 10);
          const minute = parseInt(minuteStr, 10);

          for (const day of reminder.days) {
            // JS day(0: 일, 1: 월... 6: 토) -> Expo weekday(1: 일, 2: 월... 7: 토)
            const expoWeekday = day === 0 ? 1 : day + 1;
            summary.total += 1;

            try {
              await pillReminderNotificationRepository.scheduleWeeklyNotification(
                {
                  title: `[${reminderTitle}]`,
                  body: finalBody,
                  weekday: expoWeekday,
                  hour,
                  minute,
                  data: { reminderId: reminder.id },
                },
              );
              summary.success += 1;
            } catch (e) {
              const reason = e instanceof Error ? e.message : String(e);
              summary.failed += 1;
              summary.failures.push({
                reminderId: reminder.id,
                reason,
              });
              logger.error(
                `[NOTIFICATION-SERVICE] Failed to reschedule reminderId=${reminder.id}, weekday=${expoWeekday}, time=${timeStr}: ${reason}`,
              );
            }
          }
        }
      }

      await pillReminderNotificationRepository.logScheduledNotifications();
      logger.info(
        `[NOTIFICATION-SERVICE] Reschedule summary: total=${summary.total}, success=${summary.success}, failed=${summary.failed}`,
      );
      return summary;
    } catch (e) {
      logger.error(
        `[NOTIFICATION-SERVICE] Failed to reschedule notifications: ${e}`,
      );
      return summary;
    }
  },

  // 알림 감시 시작: 사용자 액션 응답 리스너 구독, Cold Start 응답 확인 및 시스템 알림 스케줄 동기화
  startWatcher(): void {
    const hasNoSubscription = !responseSubscription;

    // 알림 응답(사용자 액션 클릭) 리스너 구독
    if (hasNoSubscription) {
      responseSubscription =
        pillReminderNotificationRepository.addNotificationResponseListener(
          (response) => {
            void this.handleNotificationResponse(response);
          },
        );
    }

    // Cold Start 알림 클릭 확인
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
