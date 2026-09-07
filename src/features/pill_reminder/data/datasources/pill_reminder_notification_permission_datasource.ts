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

  // Exact alarm은 일반 런타임 권한이 아닌 Android 특수 앱 액세스 권한이다.
  // Expo/React Native의 PermissionsAndroid.check()로는 이 권한을 판정할 수 없다.
  async getExactAlarmPermissionStatus(): Promise<boolean> {
    if (Platform.OS !== 'android' || Number(Platform.Version) < 31) {
      return true;
    }

    // SCHEDULE_EXACT_ALARM is declared in app.config.js. Its actual state is
    // enforced by Android when an exact notification is scheduled.
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
