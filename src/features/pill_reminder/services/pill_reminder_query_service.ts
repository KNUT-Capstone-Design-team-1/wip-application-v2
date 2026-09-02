import { getDatabase } from '@services/database/sqlite';
import {
  IPillReminder,
  IPillReminderItem,
} from '@features/pill_reminder/types/pill_reminder_type';
import {
  IDbReminderRow,
  IDbReminderItemRow,
  mapDbItemToReminderItem,
  mapDbReminderToModel,
} from '@features/pill_reminder/services/pill_reminder_mapper';
import logger from '@utils/logger';

// 쿼리 에러 로깅 헬퍼
const logQueryError = (operation: string, error: unknown) => {
  logger.error(
    `[PILL-REMINDER-QUERY-SERVICE] Failed to ${operation}: ${error}`,
  );
};

// 복용 알림 조회 전용 서비스
export const pillReminderQueryService = {
  // 모든 복용 알림 목록 조회
  async getReminders(): Promise<IPillReminder[]> {
    try {
      const db = await getDatabase();

      const reminders = await db.getAllAsync<IDbReminderRow>(
        `SELECT * FROM pill_reminders ORDER BY time ASC, id ASC`,
      );

      const hasNoReminders = !reminders || reminders.length === 0;

      if (hasNoReminders) {
        return [];
      }

      const reminderIds = reminders.map((r) => r.id);
      const placeholders = reminderIds.map(() => '?').join(',');

      const items = await db.getAllAsync<IDbReminderItemRow>(
        `
        SELECT 
          pri.id,
          pri.reminder_id,
          pri.item_seq,
          pri.item_name,
          pri.dosage,
          COALESCE(pd.ITEM_IMAGE, '') as ITEM_IMAGE,
          COALESCE(pd.CLASS_NAME, '') as CLASS_NAME,
          COALESCE(pd.ENTP_NAME, '') as ENTP_NAME
        FROM pill_reminder_items pri
        LEFT JOIN pill_data pd ON pri.item_seq = pd.ITEM_SEQ
        WHERE pri.reminder_id IN (${placeholders})
        ORDER BY pri.id ASC
      `,
        reminderIds,
      );

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
  },

  // 특정 알약(item_seq)이 포함된 복용 알림 목록 조회
  async getRemindersByItemSeq(itemSeq: string): Promise<IPillReminder[]> {
    try {
      const db = await getDatabase();

      const reminders = await db.getAllAsync<IDbReminderRow>(
        `
        SELECT DISTINCT pr.*
        FROM pill_reminders pr
        INNER JOIN pill_reminder_items pri ON pr.id = pri.reminder_id
        WHERE pri.item_seq = ?
        ORDER BY pr.time ASC, pr.id ASC
      `,
        [itemSeq],
      );

      const hasNoReminders = !reminders || reminders.length === 0;

      if (hasNoReminders) {
        return [];
      }

      const reminderIds = reminders.map((r) => r.id);
      const placeholders = reminderIds.map(() => '?').join(',');

      const items = await db.getAllAsync<IDbReminderItemRow>(
        `
        SELECT 
          pri.id,
          pri.reminder_id,
          pri.item_seq,
          pri.item_name,
          pri.dosage,
          COALESCE(pd.ITEM_IMAGE, '') as ITEM_IMAGE,
          COALESCE(pd.CLASS_NAME, '') as CLASS_NAME,
          COALESCE(pd.ENTP_NAME, '') as ENTP_NAME
        FROM pill_reminder_items pri
        LEFT JOIN pill_data pd ON pri.item_seq = pd.ITEM_SEQ
        WHERE pri.reminder_id IN (${placeholders})
        ORDER BY pri.id ASC
      `,
        reminderIds,
      );

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
  },

  // 특정 알림 ID로 상세 조회
  async getReminderById(id: number): Promise<IPillReminder | null> {
    try {
      const db = await getDatabase();

      const reminder = await db.getFirstAsync<IDbReminderRow>(
        `SELECT * FROM pill_reminders WHERE id = ?`,
        [id],
      );

      const isNotFound = !reminder;

      if (isNotFound) {
        return null;
      }

      const items = await db.getAllAsync<IDbReminderItemRow>(
        `
        SELECT 
          pri.id,
          pri.reminder_id,
          pri.item_seq,
          pri.item_name,
          pri.dosage,
          COALESCE(pd.ITEM_IMAGE, '') as ITEM_IMAGE,
          COALESCE(pd.CLASS_NAME, '') as CLASS_NAME,
          COALESCE(pd.ENTP_NAME, '') as ENTP_NAME
        FROM pill_reminder_items pri
        LEFT JOIN pill_data pd ON pri.item_seq = pd.ITEM_SEQ
        WHERE pri.reminder_id = ?
        ORDER BY pri.id ASC
      `,
        [id],
      );

      const mappedItems = items.map(mapDbItemToReminderItem);
      return mapDbReminderToModel(reminder, mappedItems);
    } catch (e) {
      logQueryError('get reminder by id', e);
      return null;
    }
  },

  // 특정 알약들의 상세 정보 조회
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

      const db = await getDatabase();
      const placeholders = itemSeqs.map(() => '?').join(',');

      const rows = await db.getAllAsync<{
        ITEM_SEQ: string;
        ITEM_NAME: string;
        ITEM_IMAGE?: string;
        CLASS_NAME?: string;
        ENTP_NAME?: string;
      }>(
        `
        SELECT 
          ITEM_SEQ,
          ITEM_NAME,
          COALESCE(ITEM_IMAGE, '') as ITEM_IMAGE,
          COALESCE(CLASS_NAME, '') as CLASS_NAME,
          COALESCE(ENTP_NAME, '') as ENTP_NAME
        FROM pill_data
        WHERE ITEM_SEQ IN (${placeholders})
      `,
        itemSeqs,
      );

      const map = new Map(rows.map((r) => [r.ITEM_SEQ, r]));

      const missingSeqs = itemSeqs.filter((seq) => !map.has(seq));
      let missingRows: {
        item_seq: string;
        item_name: string;
      }[] = [];

      const hasMissingSeqs = missingSeqs.length > 0;

      if (hasMissingSeqs) {
        const missingPlaceholders = missingSeqs.map(() => '?').join(',');
        missingRows = await db.getAllAsync<{
          item_seq: string;
          item_name: string;
        }>(
          `
          SELECT DISTINCT item_seq, item_name 
          FROM saved_pills 
          WHERE item_seq IN (${missingPlaceholders})
        `,
          missingSeqs,
        );
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
  },

  // 전체 보관함 폴더 목록 조회 (알약 선택 모달 탭 바용)
  async getFolders(): Promise<
    { id: number; name: string; is_default: number }[]
  > {
    try {
      const db = await getDatabase();
      const rows = await db.getAllAsync<{
        id: number;
        name: string;
        is_default: number;
      }>(`SELECT id, name, is_default FROM saved_pill_folders ORDER BY id ASC`);

      return rows;
    } catch (e) {
      logQueryError('get folders', e);
      return [];
    }
  },

  // 특정 폴더에 속한 알약 목록 조회
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
      const db = await getDatabase();
      const rows = await db.getAllAsync<{
        item_seq: string;
        item_name: string;
        ITEM_IMAGE?: string;
        CLASS_NAME?: string;
        ENTP_NAME?: string;
      }>(
        `
        SELECT 
          s.item_seq,
          COALESCE(p.ITEM_NAME, s.item_name) as item_name,
          COALESCE(p.ITEM_IMAGE, '') as ITEM_IMAGE,
          COALESCE(p.CLASS_NAME, '') as CLASS_NAME,
          COALESCE(p.ENTP_NAME, '') as ENTP_NAME
        FROM saved_pills s
        LEFT JOIN pill_data p ON s.item_seq = p.ITEM_SEQ
        WHERE s.folder_id = ?
        ORDER BY s.idx DESC
      `,
        [folderId],
      );

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
  },

  // 복용 알림에 등록된 모든 item_seq 목록 조회 (보관함 화면에서 알림 등록 여부 뱃지용)
  async getRemindedItemSeqs(): Promise<string[]> {
    try {
      const db = await getDatabase();
      const rows = await db.getAllAsync<{ item_seq: string }>(
        `SELECT DISTINCT item_seq FROM pill_reminder_items`,
      );

      return rows.map((r) => r.item_seq);
    } catch (e) {
      logQueryError('get reminded item seqs', e);
      return [];
    }
  },
};
