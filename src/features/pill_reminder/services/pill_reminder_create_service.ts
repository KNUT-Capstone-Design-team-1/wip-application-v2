import { getDatabase } from '@services/database/sqlite';
import { IPillReminderCreateForm } from '@features/pill_reminder/types/pill_reminder_type';
import {
  sanitizeReminderTitle,
  sanitizeReminderMemo,
} from '@features/pill_reminder/utils/reminder_validation';
import { pillReminderNotificationService } from '@features/pill_reminder/services/pill_reminder_notification_service';
import logger from '@utils/logger';

// 복용 알림 신규 생성 서비스
export const pillReminderCreateService = {
  async createReminders(form: IPillReminderCreateForm): Promise<number[]> {
    try {
      const {
        folder_id: explicitFolderId,
        title = '',
        memo = '',
        times,
        days,
        items,
      } = form;

      const isInvalidForm =
        times.length === 0 || days.length === 0 || items.length === 0;

      if (isInvalidForm) {
        return [];
      }

      const db = await getDatabase();
      const createdIds: number[] = [];
      const daysStr = days.sort((a, b) => a - b).join(',');

      // folder_id 결정 (명시되지 않았으면 첫 번째 알약이 속한 folder_id 조회)
      let targetFolderId = explicitFolderId || 1;

      if (!explicitFolderId && items.length > 0) {
        const firstSeq = items[0].item_seq;
        const savedPill = await db.getFirstAsync<{ folder_id: number }>(
          `SELECT folder_id FROM saved_pills WHERE item_seq = ? LIMIT 1`,
          [firstSeq],
        );

        if (savedPill?.folder_id) {
          targetFolderId = savedPill.folder_id;
        }
      }

      // 기존 알림 수 조회하여 기본 이름 카운트 계산
      const existingCountRow = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM pill_reminders`,
      );
      const baseCount = existingCountRow?.count || 0;

      const cleanMemo = sanitizeReminderMemo(memo);

      await db.withTransactionAsync(async () => {
        for (let i = 0; i < times.length; i++) {
          const time = times[i];

          // 사용자 지정 이름이 없으면 '알림 1', '알림 2' 등으로 자동 생성
          const trimmedTitle = title.trim();
          const hasUserTitle = trimmedTitle.length > 0;
          const defaultAutoTitle =
            times.length > 1
              ? `알림 ${baseCount + i + 1}`
              : `알림 ${baseCount + 1}`;

          const finalTitle = sanitizeReminderTitle(
            hasUserTitle ? trimmedTitle : defaultAutoTitle,
          );

          const result = await db.runAsync(
            `INSERT INTO pill_reminders (folder_id, title, memo, time, days, is_enabled) VALUES (?, ?, ?, ?, ?, 1)`,
            [targetFolderId, finalTitle, cleanMemo, time, daysStr],
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

      // 시스템 로컬 푸시 알림 스케줄 동기화
      pillReminderNotificationService.rescheduleAllNotifications();

      return createdIds;
    } catch (e) {
      logger.error(`[PILL-REMINDER-CREATE-SERVICE] Failed to create: ${e}`);
      throw e;
    }
  },
};
