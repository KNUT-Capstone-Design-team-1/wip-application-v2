// 복용 알림 입력값 유효성 검사 및 정제 상수
export const MAX_REMINDER_TITLE_LENGTH = 50;
export const MAX_REMINDER_MEMO_LENGTH = 255;

// 복용량 기본값 및 제한 범위
export const DEFAULT_DOSAGE = 1;
export const MIN_DOSAGE = 1;
export const MAX_DOSAGE = 20;

// 제어 문자 및 널 바이트 등 위험 특수문자 제거 정규식 (개행/탭 제외)
export const CONTROL_CHAR_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
