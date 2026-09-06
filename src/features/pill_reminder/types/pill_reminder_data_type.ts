// SQLite pill_reminders 테이블 레코드 모델
export interface IDbReminderRow {
  // 알림 고유 ID
  id: number;

  // 폴더 ID
  folder_id: number;

  // 제목
  title: string;

  // 메모
  memo: string;

  // 복용 시간 콤마 구분 문자열 (예: '08:00,12:00,18:00')
  times: string;

  // 요일 콤마 구분 문자열 (예: '1,2,3')
  days: string;

  // 활성화 플래그 (0 또는 1)
  is_enabled: number;

  // 생성 일시
  created_at: string;

  // 수정 일시
  updated_at: string;
}

// SQLite pill_reminder_items 테이블 및 JOIN 결과 모델
export interface IDbReminderItemRow {
  // 아이템 ID
  id: number;

  // 소속된 알림 ID
  reminder_id: number;

  // 품목 식별 번호
  item_seq: string;

  // 품목명
  item_name: string;

  // 1회 복용량
  dosage: number;

  // 품목 이미지 URL (JOIN pill_data)
  ITEM_IMAGE?: string;

  // 약효 분류명 (JOIN pill_data)
  CLASS_NAME?: string;

  // 제약사명 (JOIN pill_data)
  ENTP_NAME?: string;
}

// 알약 상세 정보 모델
export interface IPillReminderPillData {
  ITEM_SEQ: string;
  ITEM_NAME: string;
  ITEM_IMAGE?: string;
  CLASS_NAME?: string;
  ENTP_NAME?: string;
}

// 보관함 알약 정보 모델
export interface IPillReminderSavedPill {
  item_seq: string;
  item_name: string;
}

// 보관함 폴더 정보 모델
export interface IPillReminderFolderInfo {
  id: number;
  name: string;
  is_default: number;
}

// 알림 생성/수정용 알약 항목 페이로드
export interface IPillReminderItemPayload {
  item_seq: string;
  item_name: string;
  dosage: number;
}

// 알림 일괄 삽입용 페이로드
export interface IPillReminderInsertPayload {
  folderId: number;
  title: string;
  memo: string;
  timesStr: string;
  daysStr: string;
  items: IPillReminderItemPayload[];
}

// 주간 반복 알림 스케줄 등록 매개변수 타입
export interface IScheduleWeeklyNotificationParams {
  title: string;
  body: string;
  weekday: number;
  hour: number;
  minute: number;
  data: { reminderId: number };
}

// 스누즈(다시 알림) 스케줄 등록 매개변수 타입
export interface IScheduleSnoozeNotificationParams {
  title: string;
  body: string;
  seconds: number;
  data: { reminderId: number };
}
