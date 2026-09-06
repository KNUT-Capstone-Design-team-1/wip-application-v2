import { pillReminderSqliteDataSource } from '@features/pill_reminder/data/datasources/pill_reminder_sqlite_datasource';
import {
  IDbReminderRow,
  IDbReminderItemRow,
  IPillReminderPillData,
  IPillReminderSavedPill,
  IPillReminderFolderInfo,
  IPillReminderItemPayload,
  IPillReminderInsertPayload,
} from '@features/pill_reminder/types/pill_reminder_data_type';

// 복용 알림 데이터 저장소 리포지토리
export const pillReminderRepository = {
  async getAllReminders(): Promise<IDbReminderRow[]> {
    return await pillReminderSqliteDataSource.getAllReminders();
  },

  async getRemindersByItemSeq(itemSeq: string): Promise<IDbReminderRow[]> {
    return await pillReminderSqliteDataSource.getRemindersByItemSeq(itemSeq);
  },

  async getReminderById(id: number): Promise<IDbReminderRow | null> {
    return await pillReminderSqliteDataSource.getReminderById(id);
  },

  async getReminderItemsByReminderIds(
    reminderIds: number[],
  ): Promise<IDbReminderItemRow[]> {
    return await pillReminderSqliteDataSource.getReminderItemsByReminderIds(
      reminderIds,
    );
  },

  async getReminderItemsByReminderId(
    reminderId: number,
  ): Promise<IDbReminderItemRow[]> {
    return await pillReminderSqliteDataSource.getReminderItemsByReminderId(
      reminderId,
    );
  },

  async getPillDataBySeqs(
    itemSeqs: string[],
  ): Promise<IPillReminderPillData[]> {
    return await pillReminderSqliteDataSource.getPillDataBySeqs(itemSeqs);
  },

  async getSavedPillsBySeqs(
    itemSeqs: string[],
  ): Promise<IPillReminderSavedPill[]> {
    return await pillReminderSqliteDataSource.getSavedPillsBySeqs(itemSeqs);
  },

  async getFolderInfoByItemSeq(
    itemSeq: string,
  ): Promise<IPillReminderFolderInfo | null> {
    return await pillReminderSqliteDataSource.getFolderInfoByItemSeq(itemSeq);
  },

  async getSavedPillFolderIdByItemSeq(itemSeq: string): Promise<number | null> {
    return await pillReminderSqliteDataSource.getSavedPillFolderIdByItemSeq(
      itemSeq,
    );
  },

  async getExistingReminderCount(): Promise<number> {
    return await pillReminderSqliteDataSource.getExistingReminderCount();
  },

  async getFolders(): Promise<IPillReminderFolderInfo[]> {
    return await pillReminderSqliteDataSource.getFolders();
  },

  async getPillsByFolder(
    folderId: number,
  ): Promise<(IPillReminderSavedPill & Partial<IPillReminderPillData>)[]> {
    return await pillReminderSqliteDataSource.getPillsByFolder(folderId);
  },

  async getRemindedItemSeqs(folderId?: number): Promise<string[]> {
    return await pillReminderSqliteDataSource.getRemindedItemSeqs(folderId);
  },

  async insertReminderWithItems(
    reminders: IPillReminderInsertPayload[],
  ): Promise<number[]> {
    return await pillReminderSqliteDataSource.insertReminderWithItems(
      reminders,
    );
  },

  async updateReminderWithItems(
    id: number,
    targetFolderId: number | undefined,
    title: string,
    memo: string,
    time: string,
    daysStr: string,
    items: IPillReminderItemPayload[],
  ): Promise<void> {
    return await pillReminderSqliteDataSource.updateReminderWithItems(
      id,
      targetFolderId,
      title,
      memo,
      time,
      daysStr,
      items,
    );
  },

  async toggleReminder(id: number, isEnabled: boolean): Promise<boolean> {
    return await pillReminderSqliteDataSource.toggleReminder(id, isEnabled);
  },

  async deleteReminder(id: number): Promise<boolean> {
    return await pillReminderSqliteDataSource.deleteReminder(id);
  },

  async deleteAllReminders(): Promise<boolean> {
    return await pillReminderSqliteDataSource.deleteAllReminders();
  },
};
