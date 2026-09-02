import { Vibration } from 'react-native';
import dayjs from 'dayjs';
import { pillReminderService } from '@features/pill_reminder/services/pill_reminder_service';
import Toast from 'react-native-toast-message';
import logger from '@utils/logger';

// 복용 알림 로컬 푸시 및 인앱 알림 감시 서비스
class PillReminderNotificationService {
  private timer: NodeJS.Timeout | null = null;
  private lastTriggeredMinute = '';

  // 진동 트리거 (0.5초 진동 - 0.2초 휴식 - 0.5초 진동)
  private triggerAlarmVibration() {
    try {
      const pattern = [0, 500, 200, 500, 200, 500];
      Vibration.vibrate(pattern, false);
    } catch (e) {
      logger.error(`[NOTIFICATION-SERVICE] Failed to vibrate: ${e}`);
    }
  }

  // 현재 시각과 일치하는 복용 알림 체크 및 발송
  public async checkAndTriggerCurrentReminders() {
    try {
      const now = dayjs();
      const currentMinute = now.format('YYYY-MM-DD HH:mm');

      const isAlreadyTriggeredThisMinute =
        this.lastTriggeredMinute === currentMinute;

      if (isAlreadyTriggeredThisMinute) {
        return;
      }

      const currentTime = now.format('HH:mm');
      const currentDayNumber = now.day(); // 0: 일, 1: 월, ..., 6: 토

      const reminders = await pillReminderService.getReminders();
      const activeReminders = reminders.filter(
        (r) =>
          r.is_enabled &&
          r.time === currentTime &&
          r.days.includes(currentDayNumber),
      );

      const hasNoActiveReminders = activeReminders.length === 0;

      if (hasNoActiveReminders) {
        return;
      }

      this.lastTriggeredMinute = currentMinute;
      this.triggerAlarmVibration();

      for (const reminder of activeReminders) {
        const pillNames = reminder.items
          .map((item) => `${item.item_name} ${item.dosage}정`)
          .join(', ');

        Toast.show({
          type: 'default',
          text1: `🔔 [복용 알림] ${reminder.time} - ${pillNames}`,
          visibilityTime: 4000,
        });
      }
    } catch (e) {
      logger.error(`[NOTIFICATION-SERVICE] Failed to check reminders: ${e}`);
    }
  }

  // 알림 감시 타이머 시작
  public startWatcher() {
    const hasExistingTimer = this.timer !== null;

    if (hasExistingTimer && this.timer) {
      clearInterval(this.timer);
    }

    // 15초 주기로 알림 체크
    this.timer = setInterval(() => {
      this.checkAndTriggerCurrentReminders();
    }, 15000);
  }

  // 알림 감시 중지
  public stopWatcher() {
    const hasTimer = this.timer !== null;

    if (hasTimer && this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const pillReminderNotificationService =
  new PillReminderNotificationService();
