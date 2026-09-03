import { getDatabase } from '@services/database/sqlite';
import {
  IDbReminderRow,
  IDbReminderItemRow,
} from '@features/pill_reminder/services/pill_reminder_mapper';
import logger from '@utils/logger';

// 복용 알림 데이터소스 에러 로깅 헬퍼 함수
const logSqliteError = (operation: string, error: unknown) => {
  logger.error(
    `[PILL-REMINDER-SQLITE-DATASOURCE] Failed to ${operation}: ${error}`,
  );
};

// 복용 알림 SQLite 데이터 소스 인터페이스
export interface IPillReminderSqliteDataSource {
  getAllReminders(): Promise<IDbReminderRow[]>;

  getRemindersByItemSeq(itemSeq: string): Promise<IDbReminderRow[]>;

  getReminderById(id: number): Promise<IDbReminderRow | null>;

  getReminderItemsByReminderIds(
    reminderIds: number[],
  ): Promise<IDbReminderItemRow[]>;

  getReminderItemsByReminderId(
    reminderId: number,
  ): Promise<IDbReminderItemRow[]>;

  getPillDataBySeqs(itemSeqs: string[]): Promise<
    {
      ITEM_SEQ: string;
      ITEM_NAME: string;
      ITEM_IMAGE?: string;
      CLASS_NAME?: string;
      ENTP_NAME?: string;
    }[]
  >;

  getSavedPillsBySeqs(itemSeqs: string[]): Promise<
    {
      item_seq: string;
      item_name: string;
    }[]
  >;

  getFolderInfoByItemSeq(
    itemSeq: string,
  ): Promise<{ id: number; name: string } | null>;

  getSavedPillFolderIdByItemSeq(itemSeq: string): Promise<number | null>;

  getExistingReminderCount(): Promise<number>;

  getFolders(): Promise<{ id: number; name: string; is_default: number }[]>;

  getPillsByFolder(folderId: number): Promise<
    {
      item_seq: string;
      item_name: string;
      ITEM_IMAGE?: string;
      CLASS_NAME?: string;
      ENTP_NAME?: string;
    }[]
  >;

  getRemindedItemSeqs(folderId?: number): Promise<string[]>;

  insertReminderWithItems(
    reminders: {
      folderId: number;
      title: string;
      memo: string;
      time: string;
      daysStr: string;
      items: { item_seq: string; item_name: string; dosage: number }[];
    }[],
  ): Promise<number[]>;

  updateReminderWithItems(
    id: number,
    targetFolderId: number | undefined,
    title: string,
    memo: string,
    time: string,
    daysStr: string,
    items: { item_seq: string; item_name: string; dosage: number }[],
  ): Promise<void>;

  toggleReminder(id: number, isEnabled: boolean): Promise<boolean>;

  deleteReminder(id: number): Promise<boolean>;

  deleteAllReminders(): Promise<boolean>;
}

// SQLite 기반 복용 알림 데이터 소스 구현체
export const pillReminderSqliteDataSource: IPillReminderSqliteDataSource = {
  // 모든 복용 알림 행 조회
  async getAllReminders(): Promise<IDbReminderRow[]> {
    try {
      const db = await getDatabase();

      return await db.getAllAsync<IDbReminderRow>(
        `SELECT * FROM pill_reminders ORDER BY time ASC, id ASC`,
      );
    } catch (e) {
      logSqliteError('getAllReminders', e);
      return [];
    }
  },

  // 특정 알약이 포함된 복용 알림 행 목록 조회
  async getRemindersByItemSeq(itemSeq: string): Promise<IDbReminderRow[]> {
    try {
      const db = await getDatabase();

      return await db.getAllAsync<IDbReminderRow>(
        `
        SELECT DISTINCT pr.*
        FROM pill_reminders pr
        INNER JOIN pill_reminder_items pri ON pr.id = pri.reminder_id
        WHERE pri.item_seq = ?
        ORDER BY pr.time ASC, pr.id ASC
      `,
        [itemSeq],
      );
    } catch (e) {
      logSqliteError('getRemindersByItemSeq', e);
      return [];
    }
  },

  // ID 기준 단일 복용 알림 행 조회
  async getReminderById(id: number): Promise<IDbReminderRow | null> {
    try {
      const db = await getDatabase();

      return await db.getFirstAsync<IDbReminderRow>(
        `SELECT * FROM pill_reminders WHERE id = ?`,
        [id],
      );
    } catch (e) {
      logSqliteError('getReminderById', e);
      return null;
    }
  },

  // 여러 알림 ID들에 포함된 하위 알약 항목 조회
  async getReminderItemsByReminderIds(
    reminderIds: number[],
  ): Promise<IDbReminderItemRow[]> {
    try {
      if (reminderIds.length === 0) {
        return [];
      }

      const db = await getDatabase();

      const placeholders = reminderIds.map(() => '?').join(',');

      return await db.getAllAsync<IDbReminderItemRow>(
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
    } catch (e) {
      logSqliteError('getReminderItemsByReminderIds', e);
      return [];
    }
  },

  // 특정 알림 ID의 하위 알약 항목 조회
  async getReminderItemsByReminderId(
    reminderId: number,
  ): Promise<IDbReminderItemRow[]> {
    try {
      const db = await getDatabase();

      return await db.getAllAsync<IDbReminderItemRow>(
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
        [reminderId],
      );
    } catch (e) {
      logSqliteError('getReminderItemsByReminderId', e);
      return [];
    }
  },

  // pill_data 테이블에서 특정 item_seq 목록 조회
  async getPillDataBySeqs(itemSeqs: string[]) {
    try {
      if (itemSeqs.length === 0) {
        return [];
      }

      const db = await getDatabase();

      const placeholders = itemSeqs.map(() => '?').join(',');

      return await db.getAllAsync<{
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
    } catch (e) {
      logSqliteError('getPillDataBySeqs', e);
      return [];
    }
  },

  // saved_pills 테이블에서 누락된 item_seq 목록 조회
  async getSavedPillsBySeqs(itemSeqs: string[]) {
    try {
      if (itemSeqs.length === 0) {
        return [];
      }

      const db = await getDatabase();

      const placeholders = itemSeqs.map(() => '?').join(',');

      return await db.getAllAsync<{
        item_seq: string;
        item_name: string;
      }>(
        `
        SELECT DISTINCT item_seq, item_name 
        FROM saved_pills 
        WHERE item_seq IN (${placeholders})
      `,
        itemSeqs,
      );
    } catch (e) {
      logSqliteError('getSavedPillsBySeqs', e);
      return [];
    }
  },

  // 특정 알약이 속한 보관함 폴더 정보 조회
  async getFolderInfoByItemSeq(
    itemSeq: string,
  ): Promise<{ id: number; name: string } | null> {
    try {
      const db = await getDatabase();

      return await db.getFirstAsync<{ id: number; name: string }>(
        `
        SELECT f.id, f.name
        FROM saved_pills s
        INNER JOIN saved_pill_folders f ON s.folder_id = f.id
        WHERE s.item_seq = ?
        LIMIT 1
      `,
        [itemSeq],
      );
    } catch (e) {
      logSqliteError('getFolderInfoByItemSeq', e);
      return null;
    }
  },

  // 특정 알약의 folder_id 조회
  async getSavedPillFolderIdByItemSeq(itemSeq: string): Promise<number | null> {
    try {
      const db = await getDatabase();

      const savedPill = await db.getFirstAsync<{ folder_id: number }>(
        `SELECT folder_id FROM saved_pills WHERE item_seq = ? LIMIT 1`,
        [itemSeq],
      );

      return savedPill?.folder_id ?? null;
    } catch (e) {
      logSqliteError('getSavedPillFolderIdByItemSeq', e);
      return null;
    }
  },

  // 기존 등록된 알림 개수 조회
  async getExistingReminderCount(): Promise<number> {
    try {
      const db = await getDatabase();

      const existingCountRow = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM pill_reminders`,
      );

      return existingCountRow?.count || 0;
    } catch (e) {
      logSqliteError('getExistingReminderCount', e);
      return 0;
    }
  },

  // 전체 보관함 폴더 목록 조회
  async getFolders(): Promise<
    { id: number; name: string; is_default: number }[]
  > {
    try {
      const db = await getDatabase();

      return await db.getAllAsync<{
        id: number;
        name: string;
        is_default: number;
      }>(`SELECT id, name, is_default FROM saved_pill_folders ORDER BY id ASC`);
    } catch (e) {
      logSqliteError('getFolders', e);
      return [];
    }
  },

  // 특정 폴더에 속한 알약 목록 조회
  async getPillsByFolder(folderId: number) {
    try {
      const db = await getDatabase();

      return await db.getAllAsync<{
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
    } catch (e) {
      logSqliteError('getPillsByFolder', e);

      return [];
    }
  },

  // 복용 알림에 등록된 item_seq 목록 조회
  async getRemindedItemSeqs(folderId?: number): Promise<string[]> {
    try {
      const db = await getDatabase();

      if (folderId) {
        const rows = await db.getAllAsync<{ item_seq: string }>(
          `
          SELECT DISTINCT pri.item_seq 
          FROM pill_reminder_items pri
          INNER JOIN pill_reminders pr ON pri.reminder_id = pr.id
          WHERE pr.folder_id = ?
        `,
          [folderId],
        );

        return rows.map((r) => r.item_seq);
      }

      const rows = await db.getAllAsync<{ item_seq: string }>(
        `SELECT DISTINCT item_seq FROM pill_reminder_items`,
      );

      return rows.map((r) => r.item_seq);
    } catch (e) {
      logSqliteError('getRemindedItemSeqs', e);
      return [];
    }
  },

  // 복용 알림 및 하위 알약 항목 트랜잭션 일괄 삽입
  async insertReminderWithItems(
    reminders: {
      folderId: number;
      title: string;
      memo: string;
      time: string;
      daysStr: string;
      items: { item_seq: string; item_name: string; dosage: number }[];
    }[],
  ): Promise<number[]> {
    const db = await getDatabase();

    const createdIds: number[] = [];

    await db.withTransactionAsync(async () => {
      for (const r of reminders) {
        const result = await db.runAsync(
          `INSERT INTO pill_reminders (folder_id, title, memo, time, days, is_enabled) VALUES (?, ?, ?, ?, ?, 1)`,
          [r.folderId, r.title, r.memo, r.time, r.daysStr],
        );

        const reminderId = result.lastInsertRowId;

        createdIds.push(reminderId);

        for (const item of r.items) {
          await db.runAsync(
            `INSERT OR REPLACE INTO pill_reminder_items (reminder_id, item_seq, item_name, dosage) VALUES (?, ?, ?, ?)`,
            [reminderId, item.item_seq, item.item_name, item.dosage || 1],
          );
        }
      }
    });

    return createdIds;
  },

  // 복용 알림 및 하위 항목 트랜잭션 갱신
  async updateReminderWithItems(
    id: number,
    targetFolderId: number | undefined,
    title: string,
    memo: string,
    time: string,
    daysStr: string,
    items: { item_seq: string; item_name: string; dosage: number }[],
  ): Promise<void> {
    const db = await getDatabase();

    await db.withTransactionAsync(async () => {
      if (targetFolderId) {
        await db.runAsync(
          `UPDATE pill_reminders SET folder_id = ?, title = ?, memo = ?, time = ?, days = ?, updated_at = datetime('now', 'localtime') WHERE id = ?`,
          [targetFolderId, title, memo, time, daysStr, id],
        );
      } else {
        await db.runAsync(
          `UPDATE pill_reminders SET title = ?, memo = ?, time = ?, days = ?, updated_at = datetime('now', 'localtime') WHERE id = ?`,
          [title, memo, time, daysStr, id],
        );
      }

      await db.runAsync(
        `DELETE FROM pill_reminder_items WHERE reminder_id = ?`,
        [id],
      );

      for (const item of items) {
        await db.runAsync(
          `INSERT INTO pill_reminder_items (reminder_id, item_seq, item_name, dosage) VALUES (?, ?, ?, ?)`,
          [id, item.item_seq, item.item_name, item.dosage || 1],
        );
      }
    });
  },

  // 복용 알림 활성 상태 토글
  async toggleReminder(id: number, isEnabled: boolean): Promise<boolean> {
    try {
      const db = await getDatabase();

      await db.runAsync(
        `UPDATE pill_reminders SET is_enabled = ?, updated_at = datetime('now', 'localtime') WHERE id = ?`,
        [isEnabled ? 1 : 0, id],
      );

      return true;
    } catch (e) {
      logSqliteError('toggleReminder', e);
      return false;
    }
  },

  // 특정 복용 알림 삭제
  async deleteReminder(id: number): Promise<boolean> {
    try {
      const db = await getDatabase();

      await db.runAsync(`DELETE FROM pill_reminders WHERE id = ?`, [id]);

      return true;
    } catch (e) {
      logSqliteError('deleteReminder', e);
      return false;
    }
  },

  // 모든 복용 알림 전체 삭제
  async deleteAllReminders(): Promise<boolean> {
    try {
      const db = await getDatabase();

      await db.runAsync(`DELETE FROM pill_reminders`);

      return true;
    } catch (e) {
      logSqliteError('deleteAllReminders', e);
      return false;
    }
  },
};
