import {
  IPillReminderRepository,
  pillReminderRepository,
} from '@features/pill_reminder/data/repositories/pill_reminder_repository';
import { IPillReminderCreateForm } from '@features/pill_reminder/types/pill_reminder_type';
import {
  sanitizeReminderTitle,
  sanitizeReminderMemo,
} from '@features/pill_reminder/utils/reminder_validation';
import { pillReminderNotificationService } from '@features/pill_reminder/services/pill_reminder_notification_service';
import logger from '@utils/logger';

// 복용 알림 신규 생성 비즈니스 서비스
export class PillReminderCreateService {
  constructor(
    private readonly repository: IPillReminderRepository = pillReminderRepository,
  ) {}

  // 복용 알림 일괄 생성 유스케이스
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

      const daysStr = days.sort((a, b) => a - b).join(',');

      // folder_id 결정 (명시되지 않았으면 첫 번째 알약이 속한 폴더 또는 기본 폴더 사용)
      let targetFolderId = explicitFolderId;

      if (!explicitFolderId && items.length > 0) {
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

      if (!targetFolderId) {
        return [];
      }

      // 기존 알림 수 조회하여 기본 이름 카운트 계산
      const baseCount = await this.repository.getExistingReminderCount();
      const cleanMemo = sanitizeReminderMemo(memo);

      const remindersToInsert = times.map((time, i) => {
        const trimmedTitle = title.trim();
        const hasUserTitle = trimmedTitle.length > 0;
        const defaultAutoTitle =
          times.length > 1
            ? `알림 ${baseCount + i + 1}`
            : `알림 ${baseCount + 1}`;

        const finalTitle = sanitizeReminderTitle(
          hasUserTitle ? trimmedTitle : defaultAutoTitle,
        );

        return {
          folderId: targetFolderId,
          title: finalTitle,
          memo: cleanMemo,
          time,
          daysStr,
          items: items.map((item) => ({
            item_seq: item.item_seq,
            item_name: item.item_name,
            dosage: item.dosage || 1,
          })),
        };
      });

      const createdIds =
        await this.repository.insertReminderWithItems(remindersToInsert);

      // 시스템 로컬 푸시 알림 스케줄 동기화
      await pillReminderNotificationService.rescheduleAllNotifications();

      return createdIds;
    } catch (e) {
      logger.error(`[PILL-REMINDER-CREATE-SERVICE] Failed to create: ${e}`);
      throw e;
    }
  }
}

// 복용 알림 생성 서비스 싱글톤 인스턴스
export const pillReminderCreateService = new PillReminderCreateService();
