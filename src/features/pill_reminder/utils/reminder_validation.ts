import {
  MAX_REMINDER_TITLE_LENGTH,
  MAX_REMINDER_MEMO_LENGTH,
  MAX_REMINDER_TIMES_COUNT,
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

// 복용 알림 이름 정제
export const sanitizeReminderTitle = (title: string): string => {
  return sanitizeReminderText(title, MAX_REMINDER_TITLE_LENGTH);
};

// 복용 알림 메모 정제
export const sanitizeReminderMemo = (memo: string): string => {
  return sanitizeReminderText(memo, MAX_REMINDER_MEMO_LENGTH);
};

// 복용 시간 최대 개수 초과 여부 검증
export const validateReminderTimesLimit = (
  timesCount: number,
): { isValid: boolean; errorMessage?: string } => {
  if (timesCount >= MAX_REMINDER_TIMES_COUNT) {
    return {
      isValid: false,
      errorMessage: `복용 시간은 최대 ${MAX_REMINDER_TIMES_COUNT}개까지 등록할 수 있습니다.`,
    };
  }
  return { isValid: true };
};

// 복용 시간 목록 내 중복 여부 검증
export const validateNoDuplicateTimes = (
  times: string[],
): { isValid: boolean; duplicateTime?: string } => {
  const seen = new Set<string>();
  for (const time of times) {
    if (seen.has(time)) {
      return { isValid: false, duplicateTime: time };
    }
    seen.add(time);
  }
  return { isValid: true };
};
