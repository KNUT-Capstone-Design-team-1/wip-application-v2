import { getDatabase } from '@services/database/sqlite';
import { pillReminderNotificationService } from '@features/pill_reminder/services/pill_reminder_notification_service';
import logger from '@utils/logger';

// 복용 알림 삭제 및 토글 서비스
export const pillReminderDeleteService = {
  // 복용 알림 활성/비활성 토글
  async toggleReminder(id: number, isEnabled: boolean): Promise<boolean> {
    try {
      const db = await getDatabase();

      await db.runAsync(
        `UPDATE pill_reminders SET is_enabled = ?, updated_at = datetime('now', 'localtime') WHERE id = ?`,
        [isEnabled ? 1 : 0, id],
      );

      // 시스템 로컬 푸시 알림 스케줄 동기화
      pillReminderNotificationService.rescheduleAllNotifications();

      return true;
    } catch (e) {
      logger.error(`[PILL-REMINDER-DELETE-SERVICE] Failed to toggle: ${e}`);
      return false;
    }
  },

  // 복용 알림 단일 삭제
  async deleteReminder(id: number): Promise<boolean> {
    try {
      const db = await getDatabase();
      await db.runAsync(`DELETE FROM pill_reminders WHERE id = ?`, [id]);

      // 시스템 로컬 푸시 알림 스케줄 동기화
      pillReminderNotificationService.rescheduleAllNotifications();

      return true;
    } catch (e) {
      logger.error(`[PILL-REMINDER-DELETE-SERVICE] Failed to delete: ${e}`);
      return false;
    }
  },

  // 모든 복용 알림 전체 삭제 (해제)
  async deleteAllReminders(): Promise<boolean> {
    try {
      const db = await getDatabase();
      await db.runAsync(`DELETE FROM pill_reminders`);

      // 시스템 로컬 푸시 알림 스케줄 동기화 (모두 취소)
      pillReminderNotificationService.rescheduleAllNotifications();

      return true;
    } catch (e) {
      logger.error(`[PILL-REMINDER-DELETE-SERVICE] Failed to delete all: ${e}`);
      return false;
    }
  },
};
