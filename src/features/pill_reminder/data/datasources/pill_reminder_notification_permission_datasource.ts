import { PermissionsAndroid, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NotificationPermissionState } from '@features/pill_reminder/types/pill_reminder_notification_type';
import logger from '@utils/logger';

// 알림 응답과 권한 조회/요청을 담당한다.
export const pillReminderNotificationPermissionDataSource = {
  // 앱 실행 시 마지막 알림 응답을 조회한다.
  async getLastNotificationResponse() {
    return await Notifications.getLastNotificationResponseAsync();
  },

  // 알림 권한 상태를 조회한다.
  async getPermissions() {
    return await Notifications.getPermissionsAsync();
  },

  // Android 12+ 정확한 알람 권한 상태를 조회한다.
  async getExactAlarmPermissionStatus(): Promise<boolean> {
    try {
      const isAndroid = Platform.OS === 'android';
      if (!isAndroid) {
        return true;
      }

      const isSupportedAndroidVersion = Number(Platform.Version) >= 31;
      if (!isSupportedAndroidVersion) {
        return true;
      }

      const exactAlarmPermission =
        'android.permission.SCHEDULE_EXACT_ALARM' as any;
      const checkPermission =
        PermissionsAndroid?.check?.bind(PermissionsAndroid);
      const hasPermissionChecker = Boolean(checkPermission);
      if (!hasPermissionChecker) {
        return true;
      }

      const status = await checkPermission(exactAlarmPermission);
      const isPermissionDenied = status === false;
      return !isPermissionDenied;
    } catch (e) {
      logger.warn(
        `[NOTIFICATION-DATASOURCE] Failed to read Schedule Exact Alarm status: ${e}`,
      );
      return false;
    }
  },

  // 일반 알림과 정확한 알람 권한을 분리해서 반환한다.
  async getNotificationPermissionState(): Promise<NotificationPermissionState> {
    const permissions = await this.getPermissions();
    const notificationGranted = permissions.status === 'granted';
    const isAndroid = Platform.OS === 'android';

    if (!isAndroid) {
      return { notificationGranted };
    }

    return {
      notificationGranted,
      exactAlarmGranted: await this.getExactAlarmPermissionStatus(),
    };
  },

  // 알림 권한을 요청한다.
  async requestPermissions() {
    return await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowDisplayInCarPlay: true,
        allowCriticalAlerts: true,
        provideAppNotificationSettings: true,
      },
    });
  },
};
