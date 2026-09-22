import KoreanLunarCalendar from 'korean-lunar-calendar';

// 연도별 공휴일 맵 캐시: Map<year, Map<'YYYY-MM-DD', holidayName>>
const holidayCacheByYear = new Map<number, Map<string, string>>();

// 'YYYY-MM-DD' 형식의 문자열 반환 헬퍼
const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// 공휴일 추가
const addHoliday = (
  holidays: Map<string, string>,
  date: Date,
  name: string,
): void => {
  holidays.set(formatDateKey(date), name);
};

// 주말 여부
const isWeekend = (date: Date): boolean => {
  const day = date.getDay();

  return day === 0 || day === 6;
};

// 일요일 여부
const isSunday = (date: Date): boolean => {
  return date.getDay() === 0;
};

// 해당 날짜가 이미 공휴일이거나 주말인지 여부
const isUnavailableDate = (
  holidays: Map<string, string>,
  date: Date,
): boolean => {
  const isHoliday = holidays.has(formatDateKey(date));
  const isWeekendDay = isWeekend(date);

  return isHoliday || isWeekendDay;
};

// 다음 사용 가능한 대체공휴일 날짜 반환
const getNextSubstituteDate = (
  holidays: Map<string, string>,
  date: Date,
): Date => {
  const substituteDate = new Date(date);

  substituteDate.setDate(substituteDate.getDate() + 1);

  while (isUnavailableDate(holidays, substituteDate)) {
    substituteDate.setDate(substituteDate.getDate() + 1);
  }

  return substituteDate;
};

// 음력 날짜를 양력 Date로 변환
const getSolarDateFromLunar = (
  calendar: KoreanLunarCalendar,
  year: number,
  month: number,
  day: number,
): Date => {
  calendar.setLunarDate(year, month, day, false);

  const solar = calendar.getSolarCalendar();

  return new Date(solar.year, solar.month - 1, solar.day);
};

// 연휴 날짜 3일 생성
const getThreeDayHoliday = (centerDate: Date): [Date, Date, Date] => {
  const previousDate = new Date(centerDate);
  const nextDate = new Date(centerDate);

  previousDate.setDate(previousDate.getDate() - 1);
  nextDate.setDate(nextDate.getDate() + 1);

  return [previousDate, centerDate, nextDate];
};

// 설날/추석 연휴 추가
const addThreeDayHoliday = (
  holidays: Map<string, string>,
  dates: [Date, Date, Date],
  holidayName: string,
): void => {
  const [previousDate, centerDate, nextDate] = dates;

  addHoliday(holidays, previousDate, `${holidayName} 연휴`);

  addHoliday(holidays, centerDate, holidayName);

  addHoliday(holidays, nextDate, `${holidayName} 연휴`);
};

// 연휴에 일요일이 포함되어 있는 경우 대체공휴일 추가
const addThreeDayHolidaySubstitute = (
  holidays: Map<string, string>,
  dates: [Date, Date, Date],
  holidayName: string,
): void => {
  const hasSunday = dates.some(isSunday);

  if (!hasSunday) {
    return;
  }

  const [, , lastDate] = dates;

  const substituteDate = getNextSubstituteDate(holidays, lastDate);

  addHoliday(holidays, substituteDate, `대체공휴일(${holidayName})`);
};

// 특정 연도의 대한민국 법정 공휴일 및 대체공휴일 목록을 계산하여 캐싱
export const getKoreanHolidaysForYear = (year: number): Map<string, string> => {
  const cached = holidayCacheByYear.get(year);

  if (cached) {
    return cached;
  }

  const holidays = new Map<string, string>();
  const calendar = new KoreanLunarCalendar();

  // 1. 양력 고정 공휴일
  const fixedHolidays = [
    { date: new Date(year, 0, 1), name: '신정' },
    { date: new Date(year, 2, 1), name: '3·1절' },
    { date: new Date(year, 4, 5), name: '어린이날' },
    { date: new Date(year, 5, 6), name: '현충일' },
    { date: new Date(year, 7, 15), name: '광복절' },
    { date: new Date(year, 9, 3), name: '개천절' },
    { date: new Date(year, 9, 9), name: '한글날' },
    { date: new Date(year, 11, 25), name: '성탄절' },
  ];

  for (const holiday of fixedHolidays) {
    addHoliday(holidays, holiday.date, holiday.name);
  }

  // 2. 설날
  const seollalDay = getSolarDateFromLunar(calendar, year, 1, 1);

  const seollalDates = getThreeDayHoliday(seollalDay);

  addThreeDayHoliday(holidays, seollalDates, '설날');

  addThreeDayHolidaySubstitute(holidays, seollalDates, '설날');

  // 3. 부처님 오신 날
  const buddhaDay = getSolarDateFromLunar(calendar, year, 4, 8);

  const isBuddhaOverlap = holidays.has(formatDateKey(buddhaDay));

  if (isBuddhaOverlap) {
    const substituteDate = getNextSubstituteDate(holidays, buddhaDay);

    addHoliday(holidays, substituteDate, '대체공휴일(부처님 오신 날)');
  } else {
    addHoliday(holidays, buddhaDay, '부처님 오신 날');
  }

  // 4. 추석
  const chuseokDay = getSolarDateFromLunar(calendar, year, 8, 15);

  const chuseokDates = getThreeDayHoliday(chuseokDay);

  addThreeDayHoliday(holidays, chuseokDates, '추석');

  addThreeDayHolidaySubstitute(holidays, chuseokDates, '추석');

  // 5. 토요일/일요일과 겹치는 경우 대체공휴일 적용 대상
  const substituteTargets = [
    {
      date: new Date(year, 2, 1),
      name: '3·1절',
    },
    {
      date: new Date(year, 4, 5),
      name: '어린이날',
    },
    {
      date: buddhaDay,
      name: '부처님 오신 날',
    },
    {
      date: new Date(year, 7, 15),
      name: '광복절',
    },
    {
      date: new Date(year, 9, 3),
      name: '개천절',
    },
    {
      date: new Date(year, 9, 9),
      name: '한글날',
    },
    {
      date: new Date(year, 11, 25),
      name: '성탄절',
    },
  ];

  for (const target of substituteTargets) {
    const isWeekendDay = isWeekend(target.date);

    if (!isWeekendDay) {
      continue;
    }

    const substituteDate = getNextSubstituteDate(holidays, target.date);

    addHoliday(holidays, substituteDate, `대체공휴일(${target.name})`);
  }

  holidayCacheByYear.set(year, holidays);

  return holidays;
};

// 주어진 날짜가 대한민국 법정 공휴일 또는 대체공휴일인지 여부 판별
export const isKoreanPublicHoliday = (
  targetDate: Date = new Date(),
): boolean => {
  const year = targetDate.getFullYear();

  const holidays = getKoreanHolidaysForYear(year);

  return holidays.has(formatDateKey(targetDate));
};

// 주어진 날짜의 공휴일 명칭 반환
// 공휴일이 아니면 null
export const getKoreanHolidayName = (
  targetDate: Date = new Date(),
): string | null => {
  const year = targetDate.getFullYear();

  const holidays = getKoreanHolidaysForYear(year);

  return holidays.get(formatDateKey(targetDate)) ?? null;
};
