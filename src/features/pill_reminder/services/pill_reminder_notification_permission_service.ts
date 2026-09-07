import { Platform, Linking } from 'react-native';
import * as Application from 'expo-application';
import * as IntentLauncher from 'expo-intent-launcher';
import { pillReminderNotificationRepository } from '@features/pill_reminder/data/repositories/pill_reminder_notification_repository';
import { useCommonModalStore } from '@store/common_modal_store';
import { NotificationPermissionState } from '@features/pill_reminder/types/pill_reminder_notification_type';
import { describeScheduleError } from '@features/pill_reminder/utils/reminder_notification_trigger_helper';
import logger from '@utils/logger';

export const pillReminderNotificationPermissionService = {
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

    const applicationId = Application.applicationId;
    if (!applicationId) {
      void Linking.openSettings();
      return;
    }

    void IntentLauncher.startActivityAsync(
      'android.settings.REQUEST_SCHEDULE_EXACT_ALARM',
      { data: `package:${applicationId}` },
    ).catch((error) => {
      logger.error(
        `[NOTIFICATION-SERVICE] Failed to open exact alarm settings: ${describeScheduleError(error)}`,
      );
      void Linking.openSettings();
    });
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
          title: '알림 권한 필요',
          message:
            '복용 시간에 맞춰 알림을 받으시려면\n기기 설정에서 알림 권한을 허용해주세요.',
          confirmText: '설정으로 이동',
          cancelText: '닫기',
          onConfirm: () => this.openNotificationSettings(),
        });
      }

      return isGranted;
    } catch (e) {
      logger.error(
        `[NOTIFICATION-SERVICE] Failed to init permissions: ${describeScheduleError(e)}`,
      );
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
};
