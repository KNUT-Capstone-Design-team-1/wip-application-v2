export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// 요일 축약명 (0: 일, 1: 월, ..., 6: 토)
export const DAY_NAMES: Record<number, string> = {
  0: '일',
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
};

// 요일 전체명 (0: 일요일, 1: 월요일, ..., 6: 토요일)
export const DAY_FULL_NAMES: Record<number, string> = {
  0: '일요일',
  1: '월요일',
  2: '화요일',
  3: '수요일',
  4: '목요일',
  5: '금요일',
  6: '토요일',
};

// 전체 요일 목록 (0 ~ 6)
export const DAYS: readonly DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6] as const;
export const ALL_DAYS: number[] = [0, 1, 2, 3, 4, 5, 6];

// 평일 목록 (월 ~ 금)
export const WEEKDAYS: number[] = [1, 2, 3, 4, 5];

// 주말 목록 (일, 토)
export const WEEKENDS: number[] = [0, 6];
