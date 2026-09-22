// 시간 파싱 결과 메모이제이션 캐시 (최대 크기 초과 시 오래된 항목 자동 제거)
const MAX_CACHE_SIZE = 500;
const timeJsonArrayCache = new Map<string, string[]>();
const timeMinutesCache = new Map<string, number | null>();

// JSON 문자열, 작은따옴표 배열, 콤마 구분 문자열 등을 안전하게 문자열 배열로 파싱하는 함수 (메모이제이션 적용)
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

  // 캐시 확인
  const cached = timeJsonArrayCache.get(trimmed);
  if (cached) {
    return cached;
  }

  let result: string[] = [];

  // 1. 표준 JSON 파싱 시도
  try {
    const parsed = JSON.parse(trimmed);

    if (Array.isArray(parsed)) {
      result = parsed.map((item) => {
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
        result = parsed.map((item) => {
          if (item === null || item === undefined) {
            return '';
          }

          return String(item).trim();
        });
      }
    } catch {
      // 3. 콤마(,) 구분 또는 대괄호 내 요소 추출 시도
      const content = trimmed.replace(/^\[|\]$/g, '');

      result = content.split(',').map((p) => p.replace(/['"]/g, '').trim());
    }
  }

  // 캐시 크기 관리 및 저장
  if (timeJsonArrayCache.size >= MAX_CACHE_SIZE) {
    const firstKey = timeJsonArrayCache.keys().next().value;

    if (firstKey) {
      timeJsonArrayCache.delete(firstKey);
    }
  }

  timeJsonArrayCache.set(trimmed, result);

  return result;
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

// 4자리 숫자 또는 시간 문자열을 자정 기준 '분(Minutes)' 단위로 변환 (메모이제이션 적용)
export const parseTimeToMinutes = (timeStr?: string | null): number | null => {
  if (!timeStr) {
    return null;
  }

  const str = typeof timeStr === 'string' ? timeStr : String(timeStr);
  const trimmed = str.trim();

  if (trimmed.length === 0) {
    return null;
  }

  // 캐시 확인
  if (timeMinutesCache.has(trimmed)) {
    return timeMinutesCache.get(trimmed)!;
  }

  let clean = trimmed.replace(/[^0-9]/g, '');
  if (clean.length === 0) {
    timeMinutesCache.set(trimmed, null);
    return null;
  }

  if (clean.length === 3) {
    clean = clean.padStart(4, '0');
  }

  if (clean.length !== 4) {
    timeMinutesCache.set(trimmed, null);
    return null;
  }

  const hours = parseInt(clean.slice(0, 2), 10);
  const minutes = parseInt(clean.slice(2, 4), 10);

  const isValidHours = hours >= 0 && hours <= 24;
  const isValidMinutes = minutes >= 0 && minutes < 60;

  if (!isValidHours || !isValidMinutes) {
    timeMinutesCache.set(trimmed, null);
    return null;
  }

  const result = hours * 60 + minutes;

  // 캐시 크기 관리 및 저장
  if (timeMinutesCache.size >= MAX_CACHE_SIZE) {
    const firstKey = timeMinutesCache.keys().next().value;
    if (firstKey) {
      timeMinutesCache.delete(firstKey);
    }
  }
  timeMinutesCache.set(trimmed, result);

  return result;
};

// 원천 시간 값이 비어있거나 '0000' 등 휴무를 나타내는 값인지 판별하는 헬퍼
export const isBlankOrZeroTime = (timeStr?: string | null): boolean => {
  if (!timeStr) {
    return true;
  }
  const clean = String(timeStr).replace(/[^0-9]/g, '');
  return clean.length === 0 || /^0+$/.test(clean);
};
