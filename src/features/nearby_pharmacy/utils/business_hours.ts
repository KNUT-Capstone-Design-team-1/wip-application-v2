import {
  IPharmacyBusinessHourItem,
  IPharmacyBusinessHourSummary,
} from '@features/nearby_pharmacy/types/business_hours_type';
import { PHARMACY_DAY_LABELS } from '@features/nearby_pharmacy/constants/ui';

// JSON 문자열, 작은따옴표 배열, 콤마 구분 문자열 등을 안전하게 문자열 배열로 파싱하는 함수
export const parseTimeJsonArray = (jsonStr?: string | null | any): string[] => {
  if (!jsonStr) {
    return [];
  }

  // 이미 배열인 경우
  if (Array.isArray(jsonStr)) {
    return jsonStr.map((item) => {
      if (item === null || item === undefined) {
        return '';
      }
      return String(item).trim();
    });
  }

  if (typeof jsonStr !== 'string') {
    return [];
  }

  const trimmed = jsonStr.trim();
  if (trimmed.length === 0) {
    return [];
  }

  // 1. 표준 JSON 파싱 시도
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => {
        if (item === null || item === undefined) {
          return '';
        }
        return String(item).trim();
      });
    }
  } catch {
    // 2. Python 리스트 형태 (작은따옴표 사용: ['0900', '1800']) 파싱 시도
    try {
      const sanitized = trimmed.replace(/'/g, '"');
      const parsed = JSON.parse(sanitized);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => {
          if (item === null || item === undefined) {
            return '';
          }
          return String(item).trim();
        });
      }
    } catch {
      // 3. 콤마(,) 구분 또는 대괄호 내 요소 추출 시도
      const content = trimmed.replace(/^\[|\]$/g, '');
      const parts = content
        .split(',')
        .map((p) => p.replace(/['"]/g, '').trim());
      return parts;
    }
  }

  return [];
};

// 4자리 숫자 시간 문자열(예: '0900', '1830', '900')을 '09:00', '18:30' 형태로 포맷팅
export const formatPharmacyTime = (timeStr?: string | null): string => {
  if (!timeStr) {
    return '';
  }

  const str = typeof timeStr === 'string' ? timeStr : String(timeStr);
  const trimmed = str.trim();

  if (trimmed.length === 0) {
    return '';
  }

  const clean = trimmed.replace(/[^0-9]/g, '');
  if (clean.length === 3 || clean.length === 4) {
    const padded = clean.padStart(4, '0');
    const hour = padded.slice(0, 2);
    const minute = padded.slice(2);

    return `${hour}:${minute}`;
  }

  return trimmed;
};

// 4자리 숫자 또는 시간 문자열을 자정 기준 '분(Minutes)' 단위로 변환 (예: '0930', '930', '09:30' -> 570)
export const parseTimeToMinutes = (timeStr?: string | null): number | null => {
  if (!timeStr) {
    return null;
  }

  const str = typeof timeStr === 'string' ? timeStr : String(timeStr);
  let clean = str.replace(/[^0-9]/g, '');

  if (clean.length === 0) {
    return null;
  }

  if (clean.length === 3) {
    clean = clean.padStart(4, '0');
  }

  if (clean.length !== 4) {
    return null;
  }

  const hours = parseInt(clean.slice(0, 2), 10);
  const minutes = parseInt(clean.slice(2, 4), 10);

  const isValidHours = hours >= 0 && hours <= 24;
  const isValidMinutes = minutes >= 0 && minutes < 60;

  if (!isValidHours || !isValidMinutes) {
    return null;
  }

  return hours * 60 + minutes;
};

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
  if (openMinutes > closeMinutes) {
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
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
  if (openTime && closeTime) {
    return `${openTime} ~ ${closeTime}`;
  }

  if (openTime) {
    return `${openTime} ~`;
  }

  if (closeTime) {
    return `~ ${closeTime}`;
  }

  return '정보 없음';
};

// 단일 요일의 영업시간 아이템 객체 생성
export const createBusinessHourItem = (
  dayLabel: string,
  dayIndex: number,
  rawOpen: string,
  rawClose: string,
  todayIndex: number,
): IPharmacyBusinessHourItem => {
  const openTime = formatPharmacyTime(rawOpen);
  const closeTime = formatPharmacyTime(rawClose);
  const timeText = buildTimeText(openTime, closeTime);

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

  return {
    label: todayLabel,
    text: today.timeText,
    hasHours: true,
  };
};
