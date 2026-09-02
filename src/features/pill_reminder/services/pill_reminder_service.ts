import { pillReminderQueryService } from '@features/pill_reminder/services/pill_reminder_query_service';
import { pillReminderMutationService } from '@features/pill_reminder/services/pill_reminder_mutation_service';
import {
  IPillReminderCreateForm,
  IPillReminderUpdateForm,
} from '@features/pill_reminder/types/pill_reminder_type';

// 복용 알림 SQLite CRUD 통합 파사드 서비스
export const pillReminderService = {
  // 조회 (Read)
  getReminders: () => pillReminderQueryService.getReminders(),

  getRemindersByItemSeq: (itemSeq: string) =>
    pillReminderQueryService.getRemindersByItemSeq(itemSeq),

  getReminderById: (id: number) => pillReminderQueryService.getReminderById(id),

  getRemindedItemSeqs: (folderId?: number) =>
    pillReminderQueryService.getRemindedItemSeqs(folderId),

  getPillsBySeqs: (itemSeqs: string[]) =>
    pillReminderQueryService.getPillsBySeqs(itemSeqs),

  getFolderInfoByItemSeq: (itemSeq: string) =>
    pillReminderQueryService.getFolderInfoByItemSeq(itemSeq),

  getFolderNameByItemSeq: (itemSeq: string) =>
    pillReminderQueryService.getFolderNameByItemSeq(itemSeq),

  getFolders: () => pillReminderQueryService.getFolders(),

  getPillsByFolder: (folderId: number) =>
    pillReminderQueryService.getPillsByFolder(folderId),

  // 변경 (Write)
  createReminders: (form: IPillReminderCreateForm) =>
    pillReminderMutationService.createReminders(form),

  updateReminder: (form: IPillReminderUpdateForm) =>
    pillReminderMutationService.updateReminder(form),

  toggleReminder: (id: number, isEnabled: boolean) =>
    pillReminderMutationService.toggleReminder(id, isEnabled),

  deleteReminder: (id: number) =>
    pillReminderMutationService.deleteReminder(id),

  deleteAllReminders: () => pillReminderMutationService.deleteAllReminders(),
};

export { pillReminderQueryService, pillReminderMutationService };
