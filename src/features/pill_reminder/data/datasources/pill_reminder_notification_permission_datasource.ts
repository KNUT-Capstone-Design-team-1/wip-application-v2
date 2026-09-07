import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NotificationPermissionState } from '@features/pill_reminder/types/pill_reminder_notification_type';

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

  // Exact alarm은 일반 런타임 권한이 아니므로 설정 화면에서 허용한다.
  async getExactAlarmPermissionStatus(): Promise<boolean> {
    if (Platform.OS !== 'android' || Number(Platform.Version) < 31) {
      return true;
    }

    // Android가 예약 시 실제 허용 상태를 적용한다.
    return true;
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
