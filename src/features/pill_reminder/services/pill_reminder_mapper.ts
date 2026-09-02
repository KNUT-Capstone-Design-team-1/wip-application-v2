import {
  IPillReminder,
  IPillReminderItem,
} from '@features/pill_reminder/types/pill_reminder_type';

export interface IDbReminderRow {
  id: number;
  time: string;
  days: string;
  is_enabled: number;
  created_at: string;
  updated_at: string;
}

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

// DB Raw 아이템을 IPillReminderItem 모델로 변환
export const mapDbItemToReminderItem = (
  item: IDbReminderItemRow,
): IPillReminderItem => {
  return {
    id: item.id,
    reminder_id: item.reminder_id,
    item_seq: item.item_seq,
    item_name: item.item_name,
    dosage: item.dosage,
    item_image: item.ITEM_IMAGE || '',
    class_name: item.CLASS_NAME || '',
    entp_name: item.ENTP_NAME || '',
  };
};

// DB Raw 알림 + 아이템 목록을 IPillReminder 모델로 변환
export const mapDbReminderToModel = (
  row: IDbReminderRow,
  items: IPillReminderItem[] = [],
): IPillReminder => {
  const daysArray: number[] = row.days
    ? row.days
        .split(',')
        .map((d) => parseInt(d.trim(), 10))
        .filter((d) => !isNaN(d))
    : [];

  return {
    id: row.id,
    time: row.time,
    days: daysArray,
    is_enabled: row.is_enabled === 1,
    created_at: row.created_at,
    updated_at: row.updated_at,
    items,
  };
};
