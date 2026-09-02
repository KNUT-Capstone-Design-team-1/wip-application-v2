import {
  DayOfWeek,
  DAY_NAMES,
  DAY_FULL_NAMES,
} from '@features/pill_reminder/constants/reminder_day_constant';

export type { DayOfWeek };
export { DAY_NAMES, DAY_FULL_NAMES };

export interface IPillReminderItem {
  id?: number;
  reminder_id?: number;
  item_seq: string;
  item_name: string;
  dosage: number;
  item_image?: string;
  class_name?: string;
  entp_name?: string;
}

export interface IPillReminder {
  id: number;
  folder_id: number;
  title: string;
  memo: string;
  time: string; // 'HH:mm' format (e.g. '08:00')
  days: number[]; // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
  is_enabled: boolean;
  created_at?: string;
  updated_at?: string;
  items: IPillReminderItem[];
}

export interface IPillReminderCreateForm {
  folder_id?: number;
  title?: string;
  memo?: string;
  times: string[]; // ['08:00', '13:00', '20:00']
  days: number[]; // [0, 1, 2, 3, 4, 5, 6]
  items: {
    item_seq: string;
    item_name: string;
    dosage: number;
    item_image?: string;
    class_name?: string;
    entp_name?: string;
  }[];
}

export interface IPillReminderUpdateForm {
  id: number;
  folder_id?: number;
  title?: string;
  memo?: string;
  time: string;
  days: number[];
  items: {
    item_seq: string;
    item_name: string;
    dosage: number;
    item_image?: string;
    class_name?: string;
    entp_name?: string;
  }[];
}
