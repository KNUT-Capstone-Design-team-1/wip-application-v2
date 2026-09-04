import {
  IPillReminderRepository,
  pillReminderRepository,
} from '@features/pill_reminder/data/repositories/pill_reminder_repository';
import { IPillReminderUpdateForm } from '@features/pill_reminder/types/pill_reminder_type';
import {
  sanitizeReminderTitle,
  sanitizeReminderMemo,
} from '@features/pill_reminder/utils/reminder_validation';
import { pillReminderNotificationService } from '@features/pill_reminder/services/pill_reminder_notification_service';
import logger from '@utils/logger';

// 복용 알림 수정 비즈니스 서비스
export class PillReminderUpdateService {
  constructor(
    private readonly repository: IPillReminderRepository = pillReminderRepository,
  ) {}

  // 복용 알림 수정 유스케이스
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

      const daysStr = days.sort((a, b) => a - b).join(',');

      // folder_id 결정
      let targetFolderId = explicitFolderId;

      if (!targetFolderId && items.length > 0) {
        const firstSeq = items[0].item_seq;
        const savedFolderId =
          await this.repository.getSavedPillFolderIdByItemSeq(firstSeq);

        if (savedFolderId) {
          targetFolderId = savedFolderId;
        }
      }

      if (!targetFolderId) {
        const defaultFolder = (await this.repository.getFolders()).find(
          (folder) => folder.is_default === 1,
        );

        targetFolderId = defaultFolder?.id;
      }

      const trimmedTitle = title.trim();
      const hasUserTitle = trimmedTitle.length > 0;
      const finalTitle = sanitizeReminderTitle(
        hasUserTitle ? trimmedTitle : `알림 ${id}`,
      );
      const cleanMemo = sanitizeReminderMemo(memo);

      await this.repository.updateReminderWithItems(
        id,
        targetFolderId,
        finalTitle,
        cleanMemo,
        time,
        daysStr,
        items.map((item) => ({
          item_seq: item.item_seq,
          item_name: item.item_name,
          dosage: item.dosage || 1,
        })),
      );

      // 시스템 로컬 푸시 알림 스케줄 동기화
      await pillReminderNotificationService.rescheduleAllNotifications();

      return true;
    } catch (e) {
      logger.error(`[PILL-REMINDER-UPDATE-SERVICE] Failed to update: ${e}`);
      throw e;
    }
  }
}

// 복용 알림 수정 서비스 싱글톤 인스턴스
export const pillReminderUpdateService = new PillReminderUpdateService();
