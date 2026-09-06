import { pillReminderQueryService } from '@features/pill_reminder/services/pill_reminder_query_service';
import { pillReminderMutationService } from '@features/pill_reminder/services/pill_reminder_mutation_service';
import {
  IPillReminderCreateForm,
  IPillReminderUpdateForm,
} from '@features/pill_reminder/types/pill_reminder_type';

// 복용 알림 SQLite CRUD 통합 파사드 서비스 (Business Logic Layer)
export const pillReminderService = {
  // 모든 복용 알림 목록 조회
  getReminders() {
    return pillReminderQueryService.getReminders();
  },

  // 특정 알약이 포함된 복용 알림 목록 조회
  getRemindersByItemSeq(itemSeq: string) {
    return pillReminderQueryService.getRemindersByItemSeq(itemSeq);
  },

  // ID 기준 복용 알림 상세 조회
  getReminderById(id: number) {
    return pillReminderQueryService.getReminderById(id);
  },

  // 복용 알림에 등록된 알약 ID 목록 조회
  getRemindedItemSeqs(folderId?: number) {
    return pillReminderQueryService.getRemindedItemSeqs(folderId);
  },

  // 여러 알약들의 상세 정보 조회
  getPillsBySeqs(itemSeqs: string[]) {
    return pillReminderQueryService.getPillsBySeqs(itemSeqs);
  },

  // 알약이 속한 폴더 정보 조회
  getFolderInfoByItemSeq(itemSeq: string) {
    return pillReminderQueryService.getFolderInfoByItemSeq(itemSeq);
  },

  // 알약이 속한 폴더명 조회
  getFolderNameByItemSeq(itemSeq: string) {
    return pillReminderQueryService.getFolderNameByItemSeq(itemSeq);
  },

  // 전체 보관함 폴더 목록 조회
  getFolders() {
    return pillReminderQueryService.getFolders();
  },

  // 특정 폴더 내 알약 목록 조회
  getPillsByFolder(folderId: number) {
    return pillReminderQueryService.getPillsByFolder(folderId);
  },

  // 복용 알림 일괄 생성
  createReminders(form: IPillReminderCreateForm) {
    return pillReminderMutationService.createReminders(form);
  },

  // 복용 알림 수정
  updateReminder(form: IPillReminderUpdateForm) {
    return pillReminderMutationService.updateReminder(form);
  },

  // 복용 알림 활성/비활성 토글
  toggleReminder(id: number, isEnabled: boolean) {
    return pillReminderMutationService.toggleReminder(id, isEnabled);
  },

  // 복용 알림 단일 삭제
  deleteReminder(id: number) {
    return pillReminderMutationService.deleteReminder(id);
  },

  // 모든 복용 알림 전체 삭제
  deleteAllReminders() {
    return pillReminderMutationService.deleteAllReminders();
  },
};

export { pillReminderQueryService, pillReminderMutationService };
