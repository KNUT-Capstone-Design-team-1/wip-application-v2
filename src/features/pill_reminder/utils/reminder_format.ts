import { DAY_NAMES } from '@features/pill_reminder/types/pill_reminder_type';
import {
  DEFAULT_PERIOD,
  DEFAULT_HOUR,
  DEFAULT_MINUTE,
  TPeriod,
} from '@features/pill_reminder/constants/pill_reminder_constant';

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

// 24시간제("08:30", "13:00")를 오전/오후 12시간제("오전 8:30", "오후 1:00") 텍스트로 포맷팅
export const formatReminderTime = (time24: string): string => {
  if (!time24) {
    return '';
  }

  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr || '0', 10);
  const m = (mStr || '00').padStart(2, '0');

  if (h === 0) {
    return `오전 12:${m}`;
  }

  if (h === 12) {
    return `오후 12:${m}`;
  }

  if (h > 12) {
    return `오후 ${h - 12}:${m}`;
  }

  return `오전 ${h}:${m}`;
};

// 24시간제("08:30", "13:00")를 12시간제('오전'/'오후', '08', '30')로 변환
export const parse24To12 = (
  time24: string,
): { period: TPeriod; hour: string; minute: string } => {
  if (!time24) {
    return {
      period: DEFAULT_PERIOD,
      hour: DEFAULT_HOUR,
      minute: DEFAULT_MINUTE,
    };
  }

  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr || '8', 10);
  const minute = (mStr || '00').padStart(2, '0');

  if (h === 0) {
    return { period: '오전', hour: '12', minute };
  }

  if (h === 12) {
    return { period: '오후', hour: '12', minute };
  }

  if (h > 12) {
    const h12 = (h - 12).toString().padStart(2, '0');
    return { period: '오후', hour: h12, minute };
  }

  return { period: '오전', hour: h.toString().padStart(2, '0'), minute };
};

// 12시간제('오전'/'오후', '08', '30')를 24시간제("08:30")로 변환
export const format12To24 = (
  period: TPeriod,
  hour12: string,
  minute: string,
): string => {
  const hNum = parseInt(hour12 || '8', 10);
  const m = (minute || '00').padStart(2, '0');

  if (period === '오전') {
    const h24 = (hNum === 12 ? 0 : hNum).toString().padStart(2, '0');
    return `${h24}:${m}`;
  }

  // 오후
  const h24 = (hNum === 12 ? 12 : hNum + 12).toString().padStart(2, '0');
  return `${h24}:${m}`;
};
