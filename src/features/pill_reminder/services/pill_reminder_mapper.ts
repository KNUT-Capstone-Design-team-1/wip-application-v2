import {
  IPillReminder,
  IPillReminderItem,
} from '@features/pill_reminder/types/pill_reminder_type';

// DB pill_reminders 테이블 행 인터페이스
export interface IDbReminderRow {
  id: number;
  folder_id: number;
  title: string;
  memo: string;
  time: string;
  days: string;
  is_enabled: number;
  created_at: string;
  updated_at: string;
}

// DB pill_reminder_items 테이블 및 JOIN 결과 행 인터페이스
export interface IDbReminderItemRow {
  id: number;
  reminder_id: number;
  item_seq: string;
  item_name: string;
  dosage: number;
  ITEM_IMAGE?: string;
  CLASS_NAME?: string;
  ENTP_NAME?: string;
}

// DB 복용 알림 행을 도메인 IPillReminder 모델로 변환하는 매퍼 함수
export const mapDbReminderToModel = (
  row: IDbReminderRow,
  items: IPillReminderItem[] = [],
): IPillReminder => {
  const daysArray = row.days
    ? row.days
        .split(',')
        .map((d) => parseInt(d.trim(), 10))
        .filter((n) => !isNaN(n))
    : [];

  return {
    id: row.id,
    folder_id: row.folder_id,
    title: row.title,
    memo: row.memo,
    time: row.time,
    days: daysArray,
    is_enabled: row.is_enabled === 1,
    created_at: row.created_at,
    updated_at: row.updated_at,
    items,
  };
};

// DB 알약 항목 행을 도메인 IPillReminderItem 모델로 변환하는 매퍼 함수
export const mapDbItemToReminderItem = (
  item: IDbReminderItemRow,
): IPillReminderItem => ({
  id: item.id,
  reminder_id: item.reminder_id,
  item_seq: item.item_seq,
  item_name: item.item_name,
  dosage: item.dosage,
  item_image: item.ITEM_IMAGE || '',
  class_name: item.CLASS_NAME || '',
  entp_name: item.ENTP_NAME || '',
});
