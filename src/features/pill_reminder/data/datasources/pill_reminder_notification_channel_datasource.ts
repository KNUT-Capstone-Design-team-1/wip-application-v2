import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import {
  CHANNEL_VIBRATION_PATTERN,
  NOTIFICATION_ACTION_CONFIRM,
  NOTIFICATION_ACTION_DISMISS,
  NOTIFICATION_ACTION_SNOOZE,
  NOTIFICATION_CATEGORY_REMINDER,
  NOTIFICATION_CHANNEL_ID,
  NOTIFICATION_CHANNEL_NAME,
  NOTIFICATION_LIGHT_COLOR,
} from '@features/pill_reminder/constants/reminder_notification_constant';
import logger from '@utils/logger';

// Android 채널과 알림 액션 카테고리 설정을 담당한다.
export const pillReminderNotificationChannelDataSource = {
  // Android 채널 및 인터랙티브 알림 카테고리를 설정한다.
  async setNotificationChannel() {
    try {
      await Notifications.setNotificationCategoryAsync(
        NOTIFICATION_CATEGORY_REMINDER,
        [
          {
            identifier: NOTIFICATION_ACTION_CONFIRM,
            buttonTitle: '복용 완료',
            options: { opensAppToForeground: false },
          },
          {
            identifier: NOTIFICATION_ACTION_SNOOZE,
            buttonTitle: '5분 뒤 다시 알림',
            options: { opensAppToForeground: false },
          },
          {
            identifier: NOTIFICATION_ACTION_DISMISS,
            buttonTitle: '끄기',
            options: {
              isDestructive: true,
              opensAppToForeground: false,
            },
          },
        ],
      );

      const isAndroid = Platform.OS === 'android';
      if (isAndroid) {
        await Notifications.setNotificationChannelAsync(
          NOTIFICATION_CHANNEL_ID,
          {
            name: NOTIFICATION_CHANNEL_NAME,
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: CHANNEL_VIBRATION_PATTERN,
            lightColor: NOTIFICATION_LIGHT_COLOR,
            sound: 'default',
            enableVibrate: true,
            showBadge: true,
            lockscreenVisibility:
              Notifications.AndroidNotificationVisibility.PUBLIC,
            bypassDnd: false,
          },
        );
      }
    } catch (e) {
      logger.error(
        `[NOTIFICATION-DATASOURCE] Failed to set channel or categories: ${e}`,
      );
    }
  },
};
