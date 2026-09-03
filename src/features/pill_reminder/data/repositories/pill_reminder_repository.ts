import {
  IPillReminderSqliteDataSource,
  pillReminderSqliteDataSource,
} from '@features/pill_reminder/data/datasources/pill_reminder_sqlite_datasource';
import {
  IDbReminderRow,
  IDbReminderItemRow,
} from '@features/pill_reminder/services/pill_reminder_mapper';

// 복용 알림 데이터 저장소 리포지토리 인터페이스
export interface IPillReminderRepository {
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

// 복용 알림 데이터 저장소 리포지토리 구현체
export class PillReminderRepository implements IPillReminderRepository {
  constructor(
    private readonly dataSource: IPillReminderSqliteDataSource = pillReminderSqliteDataSource,
  ) {}

  // 모든 알림 행 조회
  async getAllReminders() {
    return await this.dataSource.getAllReminders();
  }

  // 특정 알약 포함 알림 행 조회
  async getRemindersByItemSeq(itemSeq: string) {
    return await this.dataSource.getRemindersByItemSeq(itemSeq);
  }

  // ID 기준 알림 행 조회
  async getReminderById(id: number) {
    return await this.dataSource.getReminderById(id);
  }

  // 여러 알림의 하위 알약 항목 조회
  async getReminderItemsByReminderIds(reminderIds: number[]) {
    return await this.dataSource.getReminderItemsByReminderIds(reminderIds);
  }

  // 단일 알림의 하위 알약 항목 조회
  async getReminderItemsByReminderId(reminderId: number) {
    return await this.dataSource.getReminderItemsByReminderId(reminderId);
  }

  // 알약 데이터 조회
  async getPillDataBySeqs(itemSeqs: string[]) {
    return await this.dataSource.getPillDataBySeqs(itemSeqs);
  }

  // 보관된 알약 데이터 조회
  async getSavedPillsBySeqs(itemSeqs: string[]) {
    return await this.dataSource.getSavedPillsBySeqs(itemSeqs);
  }

  // 알약이 속한 폴더 정보 조회
  async getFolderInfoByItemSeq(itemSeq: string) {
    return await this.dataSource.getFolderInfoByItemSeq(itemSeq);
  }

  // 알약의 folder_id 조회
  async getSavedPillFolderIdByItemSeq(itemSeq: string) {
    return await this.dataSource.getSavedPillFolderIdByItemSeq(itemSeq);
  }

  // 기존 등록된 알림 개수 조회
  async getExistingReminderCount() {
    return await this.dataSource.getExistingReminderCount();
  }

  // 전체 폴더 목록 조회
  async getFolders() {
    return await this.dataSource.getFolders();
  }

  // 특정 폴더의 알약 목록 조회
  async getPillsByFolder(folderId: number) {
    return await this.dataSource.getPillsByFolder(folderId);
  }

  // 알림에 등록된 알약 ID 목록 조회
  async getRemindedItemSeqs(folderId?: number) {
    return await this.dataSource.getRemindedItemSeqs(folderId);
  }

  // 알림 및 하위 항목 트랜잭션 삽입
  async insertReminderWithItems(
    reminders: {
      folderId: number;
      title: string;
      memo: string;
      time: string;
      daysStr: string;
      items: { item_seq: string; item_name: string; dosage: number }[];
    }[],
  ) {
    return await this.dataSource.insertReminderWithItems(reminders);
  }

  // 알림 및 하위 항목 트랜잭션 갱신
  async updateReminderWithItems(
    id: number,
    targetFolderId: number | undefined,
    title: string,
    memo: string,
    time: string,
    daysStr: string,
    items: { item_seq: string; item_name: string; dosage: number }[],
  ) {
    return await this.dataSource.updateReminderWithItems(
      id,
      targetFolderId,
      title,
      memo,
      time,
      daysStr,
      items,
    );
  }

  // 알림 활성 상태 토글
  async toggleReminder(id: number, isEnabled: boolean) {
    return await this.dataSource.toggleReminder(id, isEnabled);
  }

  // 알림 삭제
  async deleteReminder(id: number) {
    return await this.dataSource.deleteReminder(id);
  }

  // 전체 알림 삭제
  async deleteAllReminders() {
    return await this.dataSource.deleteAllReminders();
  }
}

// 복용 알림 리포지토리 싱글톤 인스턴스
export const pillReminderRepository = new PillReminderRepository();
