import {
  IPillReminderRepository,
  pillReminderRepository,
} from '@features/pill_reminder/data/repositories/pill_reminder_repository';
import {
  IPillReminder,
  IPillReminderItem,
} from '@features/pill_reminder/types/pill_reminder_type';
import {
  mapDbItemToReminderItem,
  mapDbReminderToModel,
} from '@features/pill_reminder/services/pill_reminder_mapper';
import logger from '@utils/logger';

// 쿼리 에러 로깅 헬퍼 함수
const logQueryError = (operation: string, error: unknown) => {
  logger.error(
    `[PILL-REMINDER-QUERY-SERVICE] Failed to ${operation}: ${error}`,
  );
};

// 복용 알림 조회 전용 비즈니스 서비스
export class PillReminderQueryService {
  constructor(
    private readonly repository: IPillReminderRepository = pillReminderRepository,
  ) {}

  // 모든 복용 알림 목록 조회 유스케이스
  async getReminders(): Promise<IPillReminder[]> {
    try {
      const reminders = await this.repository.getAllReminders();
      const hasNoReminders = !reminders || reminders.length === 0;

      if (hasNoReminders) {
        return [];
      }

      const reminderIds = reminders.map((r) => r.id);
      const items =
        await this.repository.getReminderItemsByReminderIds(reminderIds);

      const itemsByReminderId = new Map<number, IPillReminderItem[]>();

      for (const item of items) {
        const list = itemsByReminderId.get(item.reminder_id) || [];
        list.push(mapDbItemToReminderItem(item));
        itemsByReminderId.set(item.reminder_id, list);
      }

      return reminders.map((r) =>
        mapDbReminderToModel(r, itemsByReminderId.get(r.id) || []),
      );
    } catch (e) {
      logQueryError('get reminders', e);
      return [];
    }
  }

  // 특정 알약(item_seq)이 포함된 복용 알림 목록 조회 유스케이스
  async getRemindersByItemSeq(itemSeq: string): Promise<IPillReminder[]> {
    try {
      const reminders = await this.repository.getRemindersByItemSeq(itemSeq);
      const hasNoReminders = !reminders || reminders.length === 0;

      if (hasNoReminders) {
        return [];
      }

      const reminderIds = reminders.map((r) => r.id);
      const items =
        await this.repository.getReminderItemsByReminderIds(reminderIds);

      const itemsByReminderId = new Map<number, IPillReminderItem[]>();

      for (const item of items) {
        const list = itemsByReminderId.get(item.reminder_id) || [];
        list.push(mapDbItemToReminderItem(item));
        itemsByReminderId.set(item.reminder_id, list);
      }

      return reminders.map((r) =>
        mapDbReminderToModel(r, itemsByReminderId.get(r.id) || []),
      );
    } catch (e) {
      logQueryError('get reminders by itemSeq', e);
      return [];
    }
  }

  // 특정 알림 ID로 상세 조회 유스케이스
  async getReminderById(id: number): Promise<IPillReminder | null> {
    try {
      const reminder = await this.repository.getReminderById(id);
      const isNotFound = !reminder;

      if (isNotFound) {
        return null;
      }

      const items = await this.repository.getReminderItemsByReminderId(id);
      const mappedItems = items.map(mapDbItemToReminderItem);

      return mapDbReminderToModel(reminder, mappedItems);
    } catch (e) {
      logQueryError('get reminder by id', e);
      return null;
    }
  }

  // 특정 알약들의 상세 정보 조회 유스케이스
  async getPillsBySeqs(itemSeqs: string[]): Promise<
    {
      item_seq: string;
      item_name: string;
      item_image: string;
      class_name: string;
      entp_name: string;
    }[]
  > {
    try {
      const hasNoSeqs = itemSeqs.length === 0;

      if (hasNoSeqs) {
        return [];
      }

      const rows = await this.repository.getPillDataBySeqs(itemSeqs);
      const map = new Map(rows.map((r) => [r.ITEM_SEQ, r]));

      const missingSeqs = itemSeqs.filter((seq) => !map.has(seq));
      let missingRows: {
        item_seq: string;
        item_name: string;
      }[] = [];

      const hasMissingSeqs = missingSeqs.length > 0;

      if (hasMissingSeqs) {
        missingRows = await this.repository.getSavedPillsBySeqs(missingSeqs);
      }

      const missingMap = new Map(missingRows.map((r) => [r.item_seq, r]));

      return itemSeqs.map((seq) => {
        const foundData = map.get(seq);
        const hasFoundData = Boolean(foundData);

        if (hasFoundData && foundData) {
          return {
            item_seq: foundData.ITEM_SEQ,
            item_name: foundData.ITEM_NAME,
            item_image: foundData.ITEM_IMAGE || '',
            class_name: foundData.CLASS_NAME || '',
            entp_name: foundData.ENTP_NAME || '',
          };
        }

        const foundSaved = missingMap.get(seq);

        return {
          item_seq: seq,
          item_name: foundSaved?.item_name || '알 수 없는 약',
          item_image: '',
          class_name: '',
          entp_name: '',
        };
      });
    } catch (e) {
      logQueryError('get pills by seqs', e);
      return [];
    }
  }

  // 특정 알약이 속한 보관함 폴더 정보 조회 유스케이스
  async getFolderInfoByItemSeq(
    itemSeq: string,
  ): Promise<{ id: number; name: string } | null> {
    try {
      return await this.repository.getFolderInfoByItemSeq(itemSeq);
    } catch (e) {
      logQueryError('get folder info by itemSeq', e);
      return null;
    }
  }

  // 특정 알약이 속한 보관함 폴더명 조회 유스케이스
  async getFolderNameByItemSeq(itemSeq: string): Promise<string | null> {
    const info = await this.getFolderInfoByItemSeq(itemSeq);
    return info?.name || null;
  }

  // 전체 보관함 폴더 목록 조회 유스케이스
  async getFolders(): Promise<
    { id: number; name: string; is_default: number }[]
  > {
    try {
      return await this.repository.getFolders();
    } catch (e) {
      logQueryError('get folders', e);
      return [];
    }
  }

  // 특정 폴더에 속한 알약 목록 조회 유스케이스
  async getPillsByFolder(folderId: number): Promise<
    {
      item_seq: string;
      item_name: string;
      item_image: string;
      class_name: string;
      entp_name: string;
    }[]
  > {
    try {
      const rows = await this.repository.getPillsByFolder(folderId);

      return rows.map((r) => ({
        item_seq: r.item_seq,
        item_name: r.item_name,
        item_image: r.ITEM_IMAGE || '',
        class_name: r.CLASS_NAME || '',
        entp_name: r.ENTP_NAME || '',
      }));
    } catch (e) {
      logQueryError('get pills by folder', e);
      return [];
    }
  }

  // 복용 알림에 등록된 item_seq 목록 조회 유스케이스
  async getRemindedItemSeqs(folderId?: number): Promise<string[]> {
    try {
      return await this.repository.getRemindedItemSeqs(folderId);
    } catch (e) {
      logQueryError('get reminded item seqs', e);
      return [];
    }
  }
}

// 복용 알림 조회 서비스 싱글톤 인스턴스
export const pillReminderQueryService = new PillReminderQueryService();
