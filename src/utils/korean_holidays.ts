import { getHolidayPreset } from '@hyunbinseo/holidays-kr';

type HolidayMap = Awaited<ReturnType<typeof getHolidayPreset>>;
type HolidayDateKey = keyof HolidayMap;

const holidayCacheByYear = new Map<number, HolidayMap>();

const formatDateKey = (date: Date): HolidayDateKey => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}` as HolidayDateKey;
};

// 앱 시작 시 호출
export const preloadKoreanHolidays = async (
  year: number = new Date().getFullYear(),
): Promise<void> => {
  if (holidayCacheByYear.has(year)) {
    return;
  }

  const holidays = await getHolidayPreset(String(year));

  holidayCacheByYear.set(year, holidays);
};

// 주어진 날짜가 대한민국 법정 공휴일 또는 대체공휴일인지 여부 판별
export const isKoreanPublicHoliday = (
  targetDate: Date = new Date(),
): boolean => {
  const year = targetDate.getFullYear();
  const dateKey = formatDateKey(targetDate);

  const holidays = holidayCacheByYear.get(year);

  if (!holidays) {
    return false;
  }

  return dateKey in holidays;
};
