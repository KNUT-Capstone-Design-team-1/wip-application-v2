// 오전 / 오후 구분 목록
export const PERIODS = ['오전', '오후'] as const;
export type TPeriod = (typeof PERIODS)[number];

// 12시간제 피커 시간 목록 ('01' ~ '12')
export const HOURS_12: string[] = Array.from({ length: 12 }, (_, i) =>
  (i + 1).toString().padStart(2, '0'),
);

// 24시간 피커 시간 목록 ('00' ~ '23')
export const HOURS: string[] = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, '0'),
);

// 60분 피커 분 목록 ('00' ~ '59')
export const MINUTES: string[] = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, '0'),
);

// 기본 복용 시간 및 피커 초기값 상수
export const DEFAULT_REMINDER_TIME = '08:00';
export const DEFAULT_PERIOD: TPeriod = '오전';
export const DEFAULT_HOUR = '08';
export const DEFAULT_MINUTE = '00';
