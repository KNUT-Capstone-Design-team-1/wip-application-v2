import { pillReminderNotificationRepository } from '@features/pill_reminder/data/repositories/pill_reminder_notification_repository';
import { pillReminderNotificationPermissionService } from '@features/pill_reminder/services/pill_reminder_notification_permission_service';
import { pillReminderQueryService } from '@features/pill_reminder/services/pill_reminder_query_service';
import { DEFAULT_NOTIFICATION_TITLE } from '@features/pill_reminder/constants/reminder_notification_constant';
import { describeNotificationError } from '@features/pill_reminder/utils/reminder_notification_response_helper';
import {
  NotificationRescheduleSummary,
  PillReminderNotificationBodyItem,
} from '@features/pill_reminder/types/pill_reminder_notification_type';
import logger from '@utils/logger';

// 개별 복용 알림 본문 텍스트 생성
export const buildNotificationBody = (
  items: PillReminderNotificationBodyItem[],
  memo?: string,
): string => {
  const itemCount = items.length;
  let pillBody = '복용할 시간이에요!';

  const isSingleItem = itemCount === 1;
  const isMultipleItems = itemCount > 1;

  if (isSingleItem) {
    const first = items[0];
    pillBody = `${first.item_name} ${first.dosage ?? 1}정 복용할 시간이에요!`;
  } else if (isMultipleItems) {
    const first = items[0];
    pillBody = `${first.item_name} 외 ${itemCount - 1}개 복용할 시간이에요!`;
  }

  const hasMemo = Boolean(memo);
  return hasMemo ? `${pillBody}\n메모: ${memo}` : pillBody;
};

// 저장된 약 알림을 다시 OS에 안전하게 재등록하고 결과를 요약한다.
export const rescheduleAllPillReminders =
  async (): Promise<NotificationRescheduleSummary> => {
    const summary: NotificationRescheduleSummary = {
      total: 0,
      success: 0,
      failed: 0,
      failures: [],
    };

    try {
      const hasPermission =
        await pillReminderNotificationPermissionService.ensurePermissions();

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

        const finalBody = buildNotificationBody(reminder.items, reminder.memo);
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
                `[NOTIFICATION-SERVICE] Failed to reschedule reminderId=${reminder.id}, weekday=${expoWeekday}, time=${timeStr}: ${describeNotificationError(e)}`,
              );
            }
          }
        }
      }

      await pillReminderNotificationRepository.logScheduledNotifications();
      logger.info(
        `[NOTIFICATION-SERVICE] Reschedule summary: reminderCount=${activeReminders.length}, scheduleCount=${summary.total}, successCount=${summary.success}, failedCount=${summary.failed}`,
      );
      return summary;
    } catch (e) {
      logger.error(
        `[NOTIFICATION-SERVICE] Failed to reschedule notifications: ${describeNotificationError(e)}`,
      );
      return summary;
    }
  };
