import {
  IPharmacyBusinessHourItem,
  IPharmacyBusinessHourSummary,
} from '@features/nearby_pharmacy/types/business_hours_type';
import { PHARMACY_DAY_LABELS } from '@features/nearby_pharmacy/constants/ui';
import {
  parseTimeJsonArray,
  formatPharmacyTime,
  parseTimeToMinutes,
  isBlankOrZeroTime,
} from '@features/nearby_pharmacy/utils/time_parser';

// 현재 분(currentMinutes)이 영업 시간(open~close) 범위 내에 있는지 판별
export const isMinutesWithinBusinessHours = (
  currentMinutes: number,
  openMinutes: number,
  closeMinutes: number,
): boolean => {
  // 시작 시간과 마감 시간이 같거나 둘 다 0이면 휴무(영업 안 함)
  if (
    openMinutes === closeMinutes ||
    (openMinutes === 0 && closeMinutes === 0)
  ) {
    return false;
  }

  // 1. 24시간 영업 (00:00 ~ 24:00 또는 00:00 ~ 23:59)
  if (openMinutes === 0 && closeMinutes >= 1439) {
    return true;
  }

  // 2. 일반 주간 영업 (예: 09:00 ~ 19:00)
  if (openMinutes < closeMinutes) {
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  }

  // 3. 당일 야간부터 익일 새벽까지 영업하는 심야 영업 (예: 20:00 ~ 02:00)
  // 당일 검사 단계에서는 오늘 시작한 영업만 판별해야 하므로, 당일에는 currentMinutes >= openMinutes만 인정함.
  // 익일 새벽 시간대(00:00 ~ closeMinutes)는 전날(yesterdayIndex) 영업 연장 검사에서 처리됨.
  if (openMinutes > closeMinutes) {
    return currentMinutes >= openMinutes;
  }

  return false;
};

// 현재 요일의 인덱스 계산 (0: 월요일 ~ 6: 일요일)
export const getTodayIndex = (targetDate: Date = new Date()): number => {
  const day = targetDate.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일

  if (day === 0) {
    return 6;
  }

  return day - 1;
};

// 현재 시각 기준으로 해당 약국이 지금 영업 중인지 판별
export const isPharmacyOpenNow = (
  openTimeJson?: string | null,
  closeTimeJson?: string | null,
  targetDate: Date = new Date(),
): boolean => {
  if (!openTimeJson || !closeTimeJson) {
    return false;
  }

  const openTimes = parseTimeJsonArray(openTimeJson);
  const closeTimes = parseTimeJsonArray(closeTimeJson);

  if (openTimes.length === 0 || closeTimes.length === 0) {
    return false;
  }

  const todayIndex = getTodayIndex(targetDate);
  const currentMinutes = targetDate.getHours() * 60 + targetDate.getMinutes();

  // 1. 오늘 요일 영업시간 확인
  const rawOpen = openTimes[todayIndex]?.trim();
  const rawClose = closeTimes[todayIndex]?.trim();

  if (rawOpen && rawClose) {
    const openMinutes = parseTimeToMinutes(rawOpen);
    const closeMinutes = parseTimeToMinutes(rawClose);

    if (openMinutes !== null && closeMinutes !== null) {
      const isOpenToday = isMinutesWithinBusinessHours(
        currentMinutes,
        openMinutes,
        closeMinutes,
      );

      if (isOpenToday) {
        return true;
      }
    }
  }

  // 2. 자정 넘은 새벽 시간대(00:00 ~ 08:00)가 아니면 종료
  if (currentMinutes >= 480) {
    return false;
  }

  // 전날 심야영업 연장 여부 확인
  const yesterdayIndex = (todayIndex + 6) % 7;
  const yestOpen = openTimes[yesterdayIndex]?.trim();
  const yestClose = closeTimes[yesterdayIndex]?.trim();

  if (!yestOpen || !yestClose) {
    return false;
  }

  const yestOpenMin = parseTimeToMinutes(yestOpen);
  const yestCloseMin = parseTimeToMinutes(yestClose);

  if (yestOpenMin === null || yestCloseMin === null) {
    return false;
  }

  const isOvernightOpen =
    yestOpenMin > yestCloseMin && currentMinutes <= yestCloseMin;

  return isOvernightOpen;
};

// 시작 및 종료 시간 문자열을 기반으로 UI 표시용 영업시간 텍스트 생성
export const buildTimeText = (openTime: string, closeTime: string): string => {
  const trimmedOpen = openTime?.trim() ?? '';
  const trimmedClose = closeTime?.trim() ?? '';

  const isOpenBlankOrZero =
    trimmedOpen.length === 0 ||
    trimmedOpen === '00:00' ||
    isBlankOrZeroTime(trimmedOpen);

  const isCloseBlankOrZero =
    trimmedClose.length === 0 ||
    trimmedClose === '00:00' ||
    isBlankOrZeroTime(trimmedClose);

  // 시작 시간과 마감 시간이 모두 휴무 값(비어있거나 00:00/0000)인 경우
  if (isOpenBlankOrZero && isCloseBlankOrZero) {
    return '휴무';
  }

  if (trimmedOpen && trimmedClose) {
    return `${trimmedOpen} ~ ${trimmedClose}`;
  }

  if (trimmedOpen) {
    return `${trimmedOpen} ~`;
  }

  if (trimmedClose) {
    return `~ ${trimmedClose}`;
  }

  return '휴무';
};

// 단일 요일의 영업시간 아이템 객체 생성
export const createBusinessHourItem = (
  dayLabel: string,
  dayIndex: number,
  rawOpen: string,
  rawClose: string,
  todayIndex: number,
): IPharmacyBusinessHourItem => {
  const isBothClosed =
    isBlankOrZeroTime(rawOpen) && isBlankOrZeroTime(rawClose);

  const openTime = formatPharmacyTime(rawOpen);

  const closeTime = formatPharmacyTime(rawClose);

  const timeText = isBothClosed ? '휴무' : buildTimeText(openTime, closeTime);

  const isToday = dayIndex === todayIndex;

  const isHoliday = dayIndex === 7;

  const isWeekend = dayIndex === 5 || dayIndex === 6;

  return {
    dayLabel,
    dayIndex,
    openTime,
    closeTime,
    timeText,
    isToday,
    isHoliday,
    isWeekend,
  };
};

// openTime, closeTime JSON 문자열을 파싱하여 월~공휴일 영업시간 배열 생성
export const parsePharmacyBusinessHours = (
  openTimeJson?: string | null,
  closeTimeJson?: string | null,
  targetDate: Date = new Date(),
): IPharmacyBusinessHourItem[] => {
  const openTimes = parseTimeJsonArray(openTimeJson);
  const closeTimes = parseTimeJsonArray(closeTimeJson);

  const todayIndex = getTodayIndex(targetDate);

  return PHARMACY_DAY_LABELS.map((dayLabel, dayIndex) => {
    const rawOpen = openTimes[dayIndex] ?? '';
    const rawClose = closeTimes[dayIndex] ?? '';

    return createBusinessHourItem(
      dayLabel,
      dayIndex,
      rawOpen,
      rawClose,
      todayIndex,
    );
  });
};

// 오늘 요일의 영업시간 요약 정보 반환
export const getTodayBusinessHourSummary = (
  openTimeJson?: string | null,
  closeTimeJson?: string | null,
  targetDate: Date = new Date(),
): IPharmacyBusinessHourSummary => {
  const hours = parsePharmacyBusinessHours(
    openTimeJson,
    closeTimeJson,
    targetDate,
  );
  const todayIndex = getTodayIndex(targetDate);
  const todayLabel = PHARMACY_DAY_LABELS[todayIndex] ?? '월요일';
  const today = hours.find((h) => h.isToday);

  if (!today) {
    return {
      label: todayLabel,
      text: '정보 없음',
      hasHours: false,
    };
  }

  if (today.timeText === '정보 없음') {
    return {
      label: todayLabel,
      text: '정보 없음',
      hasHours: false,
    };
  }

  if (today.timeText === '휴무') {
    return {
      label: todayLabel,
      text: '휴무',
      hasHours: false,
    };
  }

  return {
    label: todayLabel,
    text: today.timeText,
    hasHours: true,
  };
};
