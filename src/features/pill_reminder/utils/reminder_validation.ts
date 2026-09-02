// 복용 알림 입력값 유효성 검사 및 SQLite 안전 문자열 정제 유틸리티

// 제어 문자 및 널 바이트 등 위험 특수문자 제거 정규식 (개행/탭 제외)

const CONTROL_CHAR_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

// 문자열 정제 (최대 글자수 및 위험 특수문자 제거)
export const sanitizeReminderText = (
  text: string,
  maxLength: number,
): string => {
  if (!text) {
    return '';
  }

  // 제어 문자 제거 후 앞뒤 공백 제거
  const cleaned = text.replace(CONTROL_CHAR_REGEX, '');
  return cleaned.slice(0, maxLength);
};

// 복용 알림 이름 정제 (최대 50자)
export const sanitizeReminderTitle = (title: string): string => {
  return sanitizeReminderText(title, 50);
};

// 복용 알림 메모 정제 (최대 255자)
export const sanitizeReminderMemo = (memo: string): string => {
  return sanitizeReminderText(memo, 255);
};
