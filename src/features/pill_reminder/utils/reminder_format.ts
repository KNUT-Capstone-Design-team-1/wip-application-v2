import { DAY_NAMES } from '@features/pill_reminder/types/pill_reminder_type';

// 요일 텍스트 포맷팅 유틸 함수 (0: 일요일, 1: 월요일, ..., 6: 토요일)
export const formatReminderDays = (days: number[]): string => {
  const isEveryday = days.length === 7;
  if (isEveryday) {
    return '매일';
  }

  const isWeekdays =
    days.length === 5 && [1, 2, 3, 4, 5].every((d) => days.includes(d));
  if (isWeekdays) {
    return '평일 (월~금)';
  }

  const isWeekends = days.length === 2 && [0, 6].every((d) => days.includes(d));
  if (isWeekends) {
    return '주말 (토·일)';
  }

  // 0(일) -> 1(월) -> 2(화) -> ... -> 6(토) 순서로 정렬
  const sortedDays = [...days].sort((a, b) => a - b);
  return sortedDays.map((d) => DAY_NAMES[d] || '').join(' · ');
};
