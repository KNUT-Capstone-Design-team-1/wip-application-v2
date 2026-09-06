import { pillReminderRepository } from '@features/pill_reminder/data/repositories/pill_reminder_repository';
import { IPillReminderCreateForm } from '@features/pill_reminder/types/pill_reminder_type';
import {
  sanitizeReminderTitle,
  sanitizeReminderMemo,
  validateNoDuplicateTimes,
} from '@features/pill_reminder/utils/reminder_validation';
import { MAX_REMINDER_TIMES_COUNT } from '@features/pill_reminder/constants/reminder_validation_constant';
import { pillReminderNotificationService } from '@features/pill_reminder/services/pill_reminder_notification_service';
import logger from '@utils/logger';

// 복용 알림 신규 생성 비즈니스 서비스
export const pillReminderCreateService = {
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

      // 시간 개수 제한 및 중복 체크
      const isTimesLimitExceeded = times.length > MAX_REMINDER_TIMES_COUNT;
      const isTimesDuplicate = !validateNoDuplicateTimes(times).isValid;
      const hasInvalidTimes = isTimesLimitExceeded || isTimesDuplicate;

      if (hasInvalidTimes) {
        return [];
      }

      const daysStr = days.sort((a, b) => a - b).join(',');

      // folder_id 결정 (명시되지 않았으면 첫 번째 알약이 속한 폴더 또는 기본 폴더 사용)
      let targetFolderId = explicitFolderId;

      if (!explicitFolderId && items.length > 0) {
        const firstSeq = items[0].item_seq;
        const savedFolderId =
          await pillReminderRepository.getSavedPillFolderIdByItemSeq(firstSeq);

        if (savedFolderId) {
          targetFolderId = savedFolderId;
        }
      }

      if (!targetFolderId) {
        const defaultFolder = (await pillReminderRepository.getFolders()).find(
          (folder) => folder.is_default === 1,
        );

        targetFolderId = defaultFolder?.id;
      }

      if (!targetFolderId) {
        return [];
      }

      const sanitizedTitle = sanitizeReminderTitle(title);
      const sanitizedMemo = sanitizeReminderMemo(memo);

      const count = await pillReminderRepository.getExistingReminderCount();
      const finalTitle =
        sanitizedTitle.length > 0 ? sanitizedTitle : `알림 ${count + 1}`;

      const timesStr = times.sort().join(',');

      const reminderPayload = {
        folderId: targetFolderId as number,
        title: finalTitle,
        memo: sanitizedMemo,
        timesStr,
        daysStr,
        items: items.map((item) => ({
          item_seq: item.item_seq,
          item_name: item.item_name,
          dosage: item.dosage || 1,
        })),
      };

      const ids = await pillReminderRepository.insertReminderWithItems([
        reminderPayload,
      ]);

      // 시스템 로컬 푸시 알림 스케줄 동기화
      await pillReminderNotificationService.rescheduleAllNotifications();

      return ids;
    } catch (e) {
      logger.error(`[PILL-REMINDER-CREATE-SERVICE] Failed to create: ${e}`);
      return [];
    }
  },
};
