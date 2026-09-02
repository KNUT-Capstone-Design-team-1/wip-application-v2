import { getDatabase } from '@services/database/sqlite';
import { IPillReminderUpdateForm } from '@features/pill_reminder/types/pill_reminder_type';
import {
  sanitizeReminderTitle,
  sanitizeReminderMemo,
} from '@features/pill_reminder/utils/reminder_validation';
import { pillReminderNotificationService } from '@features/pill_reminder/services/pill_reminder_notification_service';
import logger from '@utils/logger';

// 복용 알림 수정 서비스
export const pillReminderUpdateService = {
  async updateReminder(form: IPillReminderUpdateForm): Promise<boolean> {
    try {
      const {
        id,
        folder_id: explicitFolderId,
        title = '',
        memo = '',
        time,
        days,
        items,
      } = form;

      const isInvalidForm =
        !id || !time || days.length === 0 || items.length === 0;

      if (isInvalidForm) {
        return false;
      }

      const db = await getDatabase();
      const daysStr = days.sort((a, b) => a - b).join(',');

      // folder_id 결정
      let targetFolderId = explicitFolderId;

      if (!targetFolderId && items.length > 0) {
        const firstSeq = items[0].item_seq;
        const savedPill = await db.getFirstAsync<{ folder_id: number }>(
          `SELECT folder_id FROM saved_pills WHERE item_seq = ? LIMIT 1`,
          [firstSeq],
        );

        if (savedPill?.folder_id) {
          targetFolderId = savedPill.folder_id;
        }
      }

      const trimmedTitle = title.trim();
      const hasUserTitle = trimmedTitle.length > 0;
      const finalTitle = sanitizeReminderTitle(
        hasUserTitle ? trimmedTitle : `알림 ${id}`,
      );
      const cleanMemo = sanitizeReminderMemo(memo);

      await db.withTransactionAsync(async () => {
        if (targetFolderId) {
          await db.runAsync(
            `UPDATE pill_reminders SET folder_id = ?, title = ?, memo = ?, time = ?, days = ?, updated_at = datetime('now', 'localtime') WHERE id = ?`,
            [targetFolderId, finalTitle, cleanMemo, time, daysStr, id],
          );
        } else {
          await db.runAsync(
            `UPDATE pill_reminders SET title = ?, memo = ?, time = ?, days = ?, updated_at = datetime('now', 'localtime') WHERE id = ?`,
            [finalTitle, cleanMemo, time, daysStr, id],
          );
        }

        await db.runAsync(
          `DELETE FROM pill_reminder_items WHERE reminder_id = ?`,
          [id],
        );

        for (const item of items) {
          await db.runAsync(
            `INSERT INTO pill_reminder_items (reminder_id, item_seq, item_name, dosage) VALUES (?, ?, ?, ?)`,
            [id, item.item_seq, item.item_name, item.dosage || 1],
          );
        }
      });

      // 시스템 로컬 푸시 알림 스케줄 동기화
      pillReminderNotificationService.rescheduleAllNotifications();

      return true;
    } catch (e) {
      logger.error(`[PILL-REMINDER-UPDATE-SERVICE] Failed to update: ${e}`);
      throw e;
    }
  },
};
