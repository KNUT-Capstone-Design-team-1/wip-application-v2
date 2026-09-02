import {
  IPillReminderCreateForm,
  IPillReminderUpdateForm,
} from '@features/pill_reminder/types/pill_reminder_type';
import { pillReminderCreateService } from '@features/pill_reminder/services/pill_reminder_create_service';
import { pillReminderUpdateService } from '@features/pill_reminder/services/pill_reminder_update_service';
import { pillReminderDeleteService } from '@features/pill_reminder/services/pill_reminder_delete_service';

// 복용 알림 CUD(생성, 수정, 삭제) 파사드 서비스
export const pillReminderMutationService = {
  // 복용 알림 생성
  createReminders(form: IPillReminderCreateForm): Promise<number[]> {
    return pillReminderCreateService.createReminders(form);
  },

  // 복용 알림 수정
  updateReminder(form: IPillReminderUpdateForm): Promise<boolean> {
    return pillReminderUpdateService.updateReminder(form);
  },

  // 복용 알림 활성/비활성 토글
  toggleReminder(id: number, isEnabled: boolean): Promise<boolean> {
    return pillReminderDeleteService.toggleReminder(id, isEnabled);
  },

  // 복용 알림 단일 삭제
  deleteReminder(id: number): Promise<boolean> {
    return pillReminderDeleteService.deleteReminder(id);
  },

  // 모든 복용 알림 전체 삭제 (해제)
  deleteAllReminders(): Promise<boolean> {
    return pillReminderDeleteService.deleteAllReminders();
  },
};
