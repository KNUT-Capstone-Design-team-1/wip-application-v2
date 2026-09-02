import { getDatabase } from '@services/database/sqlite';
import {
  IPillReminderCreateForm,
  IPillReminderUpdateForm,
} from '@features/pill_reminder/types/pill_reminder_type';
import logger from '@utils/logger';

// 뮤테이션 에러 로깅 헬퍼
const logMutationError = (operation: string, error: unknown) => {
  logger.error(
    `[PILL-REMINDER-MUTATION-SERVICE] Failed to ${operation}: ${error}`,
  );
};

// 복용 알림 쓰기(생성/수정/삭제/토글) 전용 서비스
export const pillReminderMutationService = {
  // 새 복용 알림 생성
  async createReminders(form: IPillReminderCreateForm): Promise<number[]> {
    try {
      const { times, days, items } = form;

      const isInvalidForm =
        times.length === 0 || days.length === 0 || items.length === 0;

      if (isInvalidForm) {
        return [];
      }

      const db = await getDatabase();
      const createdIds: number[] = [];
      const daysStr = days.sort((a, b) => a - b).join(',');

      await db.withTransactionAsync(async () => {
        for (const time of times) {
          const result = await db.runAsync(
            `INSERT INTO pill_reminders (time, days, is_enabled) VALUES (?, ?, 1)`,
            [time, daysStr],
          );
          const reminderId = result.lastInsertRowId;
          createdIds.push(reminderId);

          for (const item of items) {
            await db.runAsync(
              `INSERT OR REPLACE INTO pill_reminder_items (reminder_id, item_seq, item_name, dosage) VALUES (?, ?, ?, ?)`,
              [reminderId, item.item_seq, item.item_name, item.dosage || 1],
            );
          }
        }
      });

      return createdIds;
    } catch (e) {
      logMutationError('create reminders', e);
      throw e;
    }
  },

  // 복용 알림 수정
  async updateReminder(form: IPillReminderUpdateForm): Promise<boolean> {
    try {
      const { id, time, days, items } = form;

      const isInvalidForm =
        !id || !time || days.length === 0 || items.length === 0;

      if (isInvalidForm) {
        return false;
      }

      const db = await getDatabase();
      const daysStr = days.sort((a, b) => a - b).join(',');

      await db.withTransactionAsync(async () => {
        await db.runAsync(
          `UPDATE pill_reminders SET time = ?, days = ?, updated_at = datetime('now', 'localtime') WHERE id = ?`,
          [time, daysStr, id],
        );

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

      return true;
    } catch (e) {
      logMutationError('update reminder', e);
      throw e;
    }
  },

  // 복용 알림 활성/비활성 토글
  async toggleReminder(id: number, isEnabled: boolean): Promise<boolean> {
    try {
      const db = await getDatabase();

      await db.runAsync(
        `UPDATE pill_reminders SET is_enabled = ?, updated_at = datetime('now', 'localtime') WHERE id = ?`,
        [isEnabled ? 1 : 0, id],
      );

      return true;
    } catch (e) {
      logMutationError('toggle reminder', e);
      return false;
    }
  },

  // 복용 알림 삭제
  async deleteReminder(id: number): Promise<boolean> {
    try {
      const db = await getDatabase();
      await db.runAsync(`DELETE FROM pill_reminders WHERE id = ?`, [id]);
      return true;
    } catch (e) {
      logMutationError('delete reminder', e);
      return false;
    }
  },
};
