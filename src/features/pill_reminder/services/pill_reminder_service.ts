import {
  PillReminderQueryService,
  pillReminderQueryService,
} from '@features/pill_reminder/services/pill_reminder_query_service';
import {
  PillReminderMutationService,
  pillReminderMutationService,
} from '@features/pill_reminder/services/pill_reminder_mutation_service';
import {
  IPillReminderCreateForm,
  IPillReminderUpdateForm,
} from '@features/pill_reminder/types/pill_reminder_type';

// 복용 알림 SQLite CRUD 통합 파사드 서비스 클래스 (Business Logic Layer)
export class PillReminderService {
  constructor(
    private readonly queryService: PillReminderQueryService = pillReminderQueryService,
    private readonly mutationService: PillReminderMutationService = pillReminderMutationService,
  ) {}

  // 모든 복용 알림 목록 조회
  getReminders() {
    return this.queryService.getReminders();
  }

  // 특정 알약이 포함된 복용 알림 목록 조회
  getRemindersByItemSeq(itemSeq: string) {
    return this.queryService.getRemindersByItemSeq(itemSeq);
  }

  // ID 기준 복용 알림 상세 조회
  getReminderById(id: number) {
    return this.queryService.getReminderById(id);
  }

  // 복용 알림에 등록된 알약 ID 목록 조회
  getRemindedItemSeqs(folderId?: number) {
    return this.queryService.getRemindedItemSeqs(folderId);
  }

  // 여러 알약들의 상세 정보 조회
  getPillsBySeqs(itemSeqs: string[]) {
    return this.queryService.getPillsBySeqs(itemSeqs);
  }

  // 알약이 속한 폴더 정보 조회
  getFolderInfoByItemSeq(itemSeq: string) {
    return this.queryService.getFolderInfoByItemSeq(itemSeq);
  }

  // 알약이 속한 폴더명 조회
  getFolderNameByItemSeq(itemSeq: string) {
    return this.queryService.getFolderNameByItemSeq(itemSeq);
  }

  // 전체 보관함 폴더 목록 조회
  getFolders() {
    return this.queryService.getFolders();
  }

  // 특정 폴더 내 알약 목록 조회
  getPillsByFolder(folderId: number) {
    return this.queryService.getPillsByFolder(folderId);
  }

  // 복용 알림 일괄 생성
  createReminders(form: IPillReminderCreateForm) {
    return this.mutationService.createReminders(form);
  }

  // 복용 알림 수정
  updateReminder(form: IPillReminderUpdateForm) {
    return this.mutationService.updateReminder(form);
  }

  // 복용 알림 활성/비활성 토글
  toggleReminder(id: number, isEnabled: boolean) {
    return this.mutationService.toggleReminder(id, isEnabled);
  }

  // 복용 알림 단일 삭제
  deleteReminder(id: number) {
    return this.mutationService.deleteReminder(id);
  }

  // 모든 복용 알림 전체 삭제
  deleteAllReminders() {
    return this.mutationService.deleteAllReminders();
  }
}

// 복용 알림 통합 파사드 서비스 싱글톤 인스턴스
export const pillReminderService = new PillReminderService();

export { pillReminderQueryService, pillReminderMutationService };
