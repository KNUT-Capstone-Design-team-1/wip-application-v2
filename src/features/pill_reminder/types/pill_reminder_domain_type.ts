// 복용 알림에 포함된 알약 아이템 도메인 모델
export interface IPillReminderItem {
  // 아이템 고유 ID
  id?: number;

  // 소속된 알림 ID
  reminder_id?: number;

  // 알약 식별 번호
  item_seq: string;

  // 알약 이름
  item_name: string;

  // 1회 복용량 (정/포)
  dosage: number;

  // 알약 이미지 URL
  item_image?: string;

  // 약효 분류명
  class_name?: string;

  // 제약업체명
  entp_name?: string;
}

// 복용 알림 도메인 모델
export interface IPillReminder {
  // 알림 고유 ID
  id: number;

  // 소속된 폴더 ID
  folder_id: number;

  // 알림 제목
  title: string;

  // 복용 메모
  memo: string;

  // 복용 시간 ('HH:mm')
  time: string;

  // 반복 요일 (0: 일, 1: 월, ... 6: 토)
  days: number[];

  // 알림 활성화 여부
  is_enabled: boolean;

  // 생성 일시
  created_at: string;

  // 수정 일시
  updated_at: string;

  // 알림에 포함된 알약 목록
  items: IPillReminderItem[];
}
