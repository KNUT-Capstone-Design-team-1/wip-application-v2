import { create } from 'zustand';
import { IPillReminder } from '@features/pill_reminder/types/pill_reminder_type';
import { pillReminderService } from '@features/pill_reminder/services/pill_reminder_service';

interface IPillReminderStore {
  reminders: IPillReminder[];
  remindedItemSeqs: string[];
  isLoading: boolean;
  fetchReminders: () => Promise<void>;
  fetchRemindedItemSeqs: (folderId?: number) => Promise<void>;
  deleteReminder: (id: number) => Promise<boolean>;
  toggleReminder: (id: number, isEnabled: boolean) => Promise<boolean>;
}

// 복용 알림 전역 상태 스토어
export const usePillReminderStore = create<IPillReminderStore>((set, get) => ({
  reminders: [],
  remindedItemSeqs: [],
  isLoading: false,

  // 전체 복용 알림 데이터 및 알림 설정된 알약 ID 목록 조회
  fetchReminders: async () => {
    set({ isLoading: true });
    try {
      const data = await pillReminderService.getReminders();
      const seqs = await pillReminderService.getRemindedItemSeqs();
      set({ reminders: data, remindedItemSeqs: seqs, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  // 알림 설정된 알약 ID 목록만 조회 (폴더 ID 지정 시 해당 폴더의 알림만 조회)
  fetchRemindedItemSeqs: async (folderId?: number) => {
    try {
      const seqs = await pillReminderService.getRemindedItemSeqs(folderId);
      set({ remindedItemSeqs: seqs });
    } catch {
      // ignore
    }
  },

  // 특정 복용 알림 삭제
  deleteReminder: async (id: number) => {
    try {
      const success = await pillReminderService.deleteReminder(id);
      if (success) {
        await get().fetchReminders();
      }
      return success;
    } catch {
      return false;
    }
  },

  // 특정 복용 알림 활성/비활성 토글
  toggleReminder: async (id: number, isEnabled: boolean) => {
    try {
      const success = await pillReminderService.toggleReminder(id, isEnabled);
      if (success) {
        set((state) => ({
          reminders: state.reminders.map((r) => {
            if (r.id === id) {
              return { ...r, is_enabled: isEnabled };
            }
            return r;
          }),
        }));
      }
      return success;
    } catch {
      return false;
    }
  },
}));
