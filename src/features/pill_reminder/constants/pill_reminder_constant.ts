import {
  DAY_NAMES,
  DAY_FULL_NAMES,
} from '@features/pill_reminder/types/pill_reminder_type';

// 24시간 피커 시간 목록 ('00' ~ '23')
export const HOURS = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, '0'),
);

// 60분 피커 분 목록 ('00' ~ '59')
export const MINUTES = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, '0'),
);

// 요일 목록 (0: 일요일, 1: 월요일, ..., 6: 토요일)
export const DAYS = [0, 1, 2, 3, 4, 5, 6] as const;
export const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
export const WEEKDAYS = [1, 2, 3, 4, 5];
export const WEEKENDS = [0, 6];

// 기본 시간 상수
export const DEFAULT_REMINDER_TIME = '08:00';
export const DEFAULT_HOUR = '08';
export const DEFAULT_MINUTE = '00';

export { DAY_NAMES, DAY_FULL_NAMES };
