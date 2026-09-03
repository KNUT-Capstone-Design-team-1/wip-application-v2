import { IPillReminderItem } from './pill_reminder_domain_type';

// 복용 알림 신규 등록 폼 모델
export interface IPillReminderCreateForm {
  // 소속 폴더 ID (생략 시 첫 번째 알약의 폴더 ID 자동 적용)
  folder_id?: number;

  // 알림 제목 (생략 시 자동 번호 부여)
  title?: string;

  // 복용 메모
  memo?: string;

  // 복용 시간 목록 ('HH:mm')
  times: string[];

  // 반복 요일 (0: 일, 1: 월, ... 6: 토)
  days: number[];

  // 복용할 알약 목록
  items: {
    item_seq: string;
    item_name: string;
    dosage?: number;
  }[];
}

// 복용 알림 수정 폼 모델
export interface IPillReminderUpdateForm {
  // 수정할 알림 ID
  id: number;

  // 소속 폴더 ID
  folder_id?: number;

  // 알림 제목
  title?: string;

  // 복용 메모
  memo?: string;

  // 복용 시간 ('HH:mm')
  time: string;

  // 반복 요일 (0: 일, 1: 월, ... 6: 토)
  days: number[];

  // 복용할 알약 목록
  items: {
    item_seq: string;
    item_name: string;
    dosage?: number;
  }[];
}

// 설정 화면 내 선택된 알약 뷰 모델
export interface ISelectedPillItem extends IPillReminderItem {
  // 알약이 속한 폴더명
  folder_name?: string;
}
