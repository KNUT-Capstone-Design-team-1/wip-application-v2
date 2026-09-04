import dayjs from 'dayjs';
import {
  IPillReminderNotificationRepository,
  pillReminderNotificationRepository,
} from '@features/pill_reminder/data/repositories/pill_reminder_notification_repository';
import {
  PillReminderQueryService,
  pillReminderQueryService,
} from '@features/pill_reminder/services/pill_reminder_query_service';
import { formatReminderTime } from '@features/pill_reminder/utils/reminder_format';
import {
  DEFAULT_NOTIFICATION_TITLE,
  NOTIFICATION_WATCHER_INTERVAL_MS,
  NOTIFICATION_TOAST_VISIBILITY_MS,
} from '@features/pill_reminder/constants/reminder_notification_constant';
import Toast from 'react-native-toast-message';
import logger from '@utils/logger';

// 복용 알림 로컬 푸시 및 인앱 알림 통합 비즈니스 서비스
export class PillReminderNotificationService {
  private timer: NodeJS.Timeout | null = null;
  private lastTriggeredMinute = '';
  private permissionInitialization: Promise<boolean> | null = null;

  constructor(
    private readonly notificationRepository: IPillReminderNotificationRepository = pillReminderNotificationRepository,
    private readonly queryService: PillReminderQueryService = pillReminderQueryService,
  ) {}

  // 시스템 알림 채널 및 권한 초기화 유스케이스
  public async initPermissions() {
    try {
      const existingStatus = await this.notificationRepository.getPermissions();
      let finalStatus = existingStatus.status;

      const isNotGranted = existingStatus.status !== 'granted';

      if (isNotGranted) {
        const statusResponse =
          await this.notificationRepository.requestPermissions();
        finalStatus = statusResponse.status;
      }

      await this.notificationRepository.setNotificationChannel();

      return finalStatus === 'granted';
    } catch (e) {
      logger.error(`[NOTIFICATION-SERVICE] Failed to init permissions: ${e}`);
      return false;
    }
  }

  private async ensurePermissions() {
    if (!this.permissionInitialization) {
      this.permissionInitialization = this.initPermissions();
    }

    return this.permissionInitialization;
  }

  // 등록된 모든 활성 복용 알림을 OS 시스템 스케줄러에 등록 유스케이스 (앱 종료 시에도 작동)
  public async rescheduleAllNotifications() {
    try {
      const hasPermission = await this.ensurePermissions();

      if (!hasPermission) {
        return;
      }

      // 기존 스케줄된 모든 로컬 알림 취소
      await this.notificationRepository.cancelAllScheduledNotifications();

      const reminders = await this.queryService.getReminders();

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

          await this.notificationRepository.scheduleWeeklyNotification({
            title: `🔔 [${reminderTitle}]`,
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
  }

  // 포그라운드 시 현재 시각과 일치하는 복용 알림 체크 및 즉시 인앱 알림 발송 유스케이스
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
      const currentDayNumber = now.day();

      const reminders = await this.queryService.getReminders();
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
      this.notificationRepository.triggerVibration();

      for (const reminder of activeReminders) {
        const itemCount = reminder.items.length;
        let pillNames = '';

        if (itemCount === 1) {
          const first = reminder.items[0];
          pillNames = `${first.item_name} ${first.dosage}정`;
        } else if (itemCount > 1) {
          const first = reminder.items[0];
          pillNames = `${first.item_name} 외 ${itemCount - 1}개`;
        }

        const formattedTime = formatReminderTime(reminder.time);
        const reminderTitle = reminder.title || DEFAULT_NOTIFICATION_TITLE;

        Toast.show({
          type: 'default',
          text1: `🔔 [${reminderTitle}] ${formattedTime} - ${pillNames}`,
          text2: reminder.memo ? `📝 ${reminder.memo}` : undefined,
          visibilityTime: NOTIFICATION_TOAST_VISIBILITY_MS,
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

    // 주기적인 인앱 체크
    this.timer = setInterval(() => {
      this.checkAndTriggerCurrentReminders();
    }, NOTIFICATION_WATCHER_INTERVAL_MS);

    void this.rescheduleAllNotifications();
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

// 복용 알림 노티피케이션 서비스 싱글톤 인스턴스
export const pillReminderNotificationService =
  new PillReminderNotificationService();
