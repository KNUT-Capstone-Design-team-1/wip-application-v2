import {
  IPillReminderCreateForm,
  IPillReminderUpdateForm,
} from '@features/pill_reminder/types/pill_reminder_type';
import {
  PillReminderCreateService,
  pillReminderCreateService,
} from '@features/pill_reminder/services/pill_reminder_create_service';
import {
  PillReminderUpdateService,
  pillReminderUpdateService,
} from '@features/pill_reminder/services/pill_reminder_update_service';
import {
  PillReminderDeleteService,
  pillReminderDeleteService,
} from '@features/pill_reminder/services/pill_reminder_delete_service';

// 복용 알림 CUD(생성, 수정, 삭제) 파사드 서비스 클래스 (Business Logic Layer)
export class PillReminderMutationService {
  constructor(
    private readonly createService: PillReminderCreateService = pillReminderCreateService,
    private readonly updateService: PillReminderUpdateService = pillReminderUpdateService,
    private readonly deleteService: PillReminderDeleteService = pillReminderDeleteService,
  ) {}

  // 복용 알림 생성
  createReminders(form: IPillReminderCreateForm): Promise<number[]> {
    return this.createService.createReminders(form);
  }

  // 복용 알림 수정
  updateReminder(form: IPillReminderUpdateForm): Promise<boolean> {
    return this.updateService.updateReminder(form);
  }

  // 복용 알림 활성/비활성 토글
  toggleReminder(id: number, isEnabled: boolean): Promise<boolean> {
    return this.deleteService.toggleReminder(id, isEnabled);
  }

  // 복용 알림 단일 삭제
  deleteReminder(id: number): Promise<boolean> {
    return this.deleteService.deleteReminder(id);
  }

  // 모든 복용 알림 전체 삭제 (해제)
  deleteAllReminders(): Promise<boolean> {
    return this.deleteService.deleteAllReminders();
  }
}

// 복용 알림 CUD 파사드 서비스 싱글톤 인스턴스
export const pillReminderMutationService = new PillReminderMutationService();
