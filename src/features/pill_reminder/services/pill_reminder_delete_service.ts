import {
  IPillReminderRepository,
  pillReminderRepository,
} from '@features/pill_reminder/data/repositories/pill_reminder_repository';
import { pillReminderNotificationService } from '@features/pill_reminder/services/pill_reminder_notification_service';
import logger from '@utils/logger';

// 복용 알림 삭제 및 활성 토글 비즈니스 서비스
export class PillReminderDeleteService {
  constructor(
    private readonly repository: IPillReminderRepository = pillReminderRepository,
  ) {}

  // 복용 알림 활성/비활성 토글 유스케이스
  async toggleReminder(id: number, isEnabled: boolean): Promise<boolean> {
    try {
      const result = await this.repository.toggleReminder(id, isEnabled);

      // 시스템 로컬 푸시 알림 스케줄 동기화
      await pillReminderNotificationService.rescheduleAllNotifications();

      return result;
    } catch (e) {
      logger.error(`[PILL-REMINDER-DELETE-SERVICE] Failed to toggle: ${e}`);
      return false;
    }
  }

  // 복용 알림 단일 삭제 유스케이스
  async deleteReminder(id: number): Promise<boolean> {
    try {
      const result = await this.repository.deleteReminder(id);

      // 시스템 로컬 푸시 알림 스케줄 동기화
      await pillReminderNotificationService.rescheduleAllNotifications();

      return result;
    } catch (e) {
      logger.error(`[PILL-REMINDER-DELETE-SERVICE] Failed to delete: ${e}`);
      return false;
    }
  }

  // 모든 복용 알림 전체 삭제 유스케이스
  async deleteAllReminders(): Promise<boolean> {
    try {
      const result = await this.repository.deleteAllReminders();

      // 시스템 로컬 푸시 알림 스케줄 동기화 (모두 취소)
      await pillReminderNotificationService.rescheduleAllNotifications();

      return result;
    } catch (e) {
      logger.error(`[PILL-REMINDER-DELETE-SERVICE] Failed to delete all: ${e}`);
      return false;
    }
  }
}

// 복용 알림 삭제 서비스 싱글톤 인스턴스
export const pillReminderDeleteService = new PillReminderDeleteService();
