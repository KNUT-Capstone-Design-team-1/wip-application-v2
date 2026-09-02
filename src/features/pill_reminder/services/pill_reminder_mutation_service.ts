import { pillReminderCreateService } from '@features/pill_reminder/services/pill_reminder_create_service';
import { pillReminderUpdateService } from '@features/pill_reminder/services/pill_reminder_update_service';
import { pillReminderDeleteService } from '@features/pill_reminder/services/pill_reminder_delete_service';
import {
  IPillReminderCreateForm,
  IPillReminderUpdateForm,
} from '@features/pill_reminder/types/pill_reminder_type';

// 복용 알림 쓰기(생성/수정/삭제/토글) 통합 파사드 서비스
export const pillReminderMutationService = {
  // 새 복용 알림 생성
  createReminders: (form: IPillReminderCreateForm): Promise<number[]> =>
    pillReminderCreateService.createReminders(form),

  // 복용 알림 수정
  updateReminder: (form: IPillReminderUpdateForm): Promise<boolean> =>
    pillReminderUpdateService.updateReminder(form),

  // 복용 알림 활성/비활성 토글
  toggleReminder: (id: number, isEnabled: boolean): Promise<boolean> =>
    pillReminderDeleteService.toggleReminder(id, isEnabled),

  // 복용 알림 삭제
  deleteReminder: (id: number): Promise<boolean> =>
    pillReminderDeleteService.deleteReminder(id),
};

export {
  pillReminderCreateService,
  pillReminderUpdateService,
  pillReminderDeleteService,
};
