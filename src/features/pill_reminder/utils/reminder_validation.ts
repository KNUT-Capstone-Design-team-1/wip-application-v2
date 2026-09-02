import {
  MAX_REMINDER_TITLE_LENGTH,
  MAX_REMINDER_MEMO_LENGTH,
  CONTROL_CHAR_REGEX,
} from '@features/pill_reminder/constants/reminder_validation_constant';

// 문자열 정제 (최대 글자수 및 제어 문자 제거)
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
  return sanitizeReminderText(title, MAX_REMINDER_TITLE_LENGTH);
};

// 복용 알림 메모 정제 (최대 255자)
export const sanitizeReminderMemo = (memo: string): string => {
  return sanitizeReminderText(memo, MAX_REMINDER_MEMO_LENGTH);
};
