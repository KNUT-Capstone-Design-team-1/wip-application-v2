import {
  isPharmacyOpenNow,
  parsePharmacyBusinessHours,
  getTodayBusinessHourSummary,
} from '@features/nearby_pharmacy/utils/business_hours';
import {
  formatPharmacyTime,
  parseTimeToMinutes,
} from '@features/nearby_pharmacy/utils/time_parser';

describe('business_hours utils 테스트', () => {
  describe('formatPharmacyTime', () => {
    it('4자리 문자열을 시:분 형태로 변환해야 한다', () => {
      expect(formatPharmacyTime('0900')).toBe('09:00');
      expect(formatPharmacyTime('1830')).toBe('18:30');
    });

    it('빈 값이면 빈 문자열을 반환해야 한다', () => {
      expect(formatPharmacyTime('')).toBe('');
      expect(formatPharmacyTime(null)).toBe('');
    });
  });

  describe('parseTimeToMinutes', () => {
    it('4자리 시간 문자열을 자정 기준 분 단위로 변환해야 한다', () => {
      expect(parseTimeToMinutes('0900')).toBe(540);
      expect(parseTimeToMinutes('09:30')).toBe(570);
      expect(parseTimeToMinutes('1800')).toBe(1080);
    });
  });

  describe('getTodayBusinessHourSummary', () => {
    const monday = new Date(2026, 8, 21, 12, 0); // 월요일
    const tuesday = new Date(2026, 8, 22, 12, 0); // 화요일
    const openTimes = JSON.stringify(['0900', '1000', '', '', '', '', '', '']);
    const closeTimes = JSON.stringify(['1800', '1900', '', '', '', '', '', '']);

    it('현재 요일 레이블(월요일, 화요일 등)을 반환해야 한다', () => {
      const mondaySummary = getTodayBusinessHourSummary(
        openTimes,
        closeTimes,
        monday,
      );
      expect(mondaySummary.label).toBe('월요일');
      expect(mondaySummary.text).toBe('09:00 ~ 18:00');
      expect(mondaySummary.hasHours).toBe(true);

      const tuesdaySummary = getTodayBusinessHourSummary(
        openTimes,
        closeTimes,
        tuesday,
      );
      expect(tuesdaySummary.label).toBe('화요일');
      expect(tuesdaySummary.text).toBe('10:00 ~ 19:00');
      expect(tuesdaySummary.hasHours).toBe(true);
    });
  });

  describe('isPharmacyOpenNow', () => {
    // 월요일 기준 (2026-09-21 은 월요일)
    const mondayNoon = new Date(2026, 8, 21, 12, 0); // 12:00 (월요일)
    const mondayNight = new Date(2026, 8, 21, 22, 0); // 22:00 (월요일)

    const openTimes = JSON.stringify([
      '0900',
      '0900',
      '0900',
      '0900',
      '0900',
      '0900',
      '',
      '',
    ]);
    const closeTimes = JSON.stringify([
      '1800',
      '1800',
      '1800',
      '1800',
      '1800',
      '1800',
      '',
      '',
    ]);

    it('영업 시간 내에는 true를 반환해야 한다', () => {
      expect(isPharmacyOpenNow(openTimes, closeTimes, mondayNoon)).toBe(true);
    });

    it('파이썬 형태의 작은따옴표 배열 문자열도 정상 파싱 및 판별해야 한다', () => {
      const pythonOpen =
        "['0900', '0900', '0900', '0900', '0900', '0900', '', '']";
      const pythonClose =
        "['1800', '1800', '1800', '1800', '1800', '1800', '', '']";
      expect(isPharmacyOpenNow(pythonOpen, pythonClose, mondayNoon)).toBe(true);
    });

    it('3자리 시간 문자열(900 등)도 정상 판별해야 한다', () => {
      const shortOpen = JSON.stringify([
        '900',
        '900',
        '900',
        '900',
        '900',
        '900',
        '',
        '',
      ]);
      const shortClose = JSON.stringify([
        '1800',
        '1800',
        '1800',
        '1800',
        '1800',
        '1800',
        '',
        '',
      ]);
      expect(isPharmacyOpenNow(shortOpen, shortClose, mondayNoon)).toBe(true);
    });

    it('영업 종료 후에는 false를 반환해야 한다', () => {
      expect(isPharmacyOpenNow(openTimes, closeTimes, mondayNight)).toBe(false);
    });

    it('월요일 밤에 시작되어 화요일 새벽까지 이어지는 심야 약국을 화요일 새벽에 정상 판별해야 한다', () => {
      const tuesdayDawn = new Date(2026, 8, 22, 2, 30); // 화요일 02:30
      const overnightOpen = JSON.stringify([
        '2000',
        '0900',
        '0900',
        '0900',
        '0900',
        '0900',
        '',
        '',
      ]);
      const overnightClose = JSON.stringify([
        '0400',
        '1800',
        '1800',
        '1800',
        '1800',
        '1800',
        '',
        '',
      ]);
      expect(
        isPharmacyOpenNow(overnightOpen, overnightClose, tuesdayDawn),
      ).toBe(true);
    });

    it('금요일 당일 심야 영업(20:00~익일 02:00)의 경우 금요일 새벽(01:30)에는 영업중이 아니어야 한다 (당일 새벽 오판별 방지)', () => {
      // 2026-09-18은 평일 금요일 (2026-09-25는 추석 공휴일)
      const fridayDawn = new Date(2026, 8, 18, 1, 30); // 금요일 01:30
      const fridayBeforeOpen = new Date(2026, 8, 18, 19, 59); // 금요일 19:59
      const fridayOpen = new Date(2026, 8, 18, 20, 0); // 금요일 20:00
      const fridayLateNight = new Date(2026, 8, 18, 23, 59); // 금요일 23:59

      // 금요일(인덱스 4)만 20:00 ~ 02:00 심야 영업, 목요일(인덱스 3)은 일반 영업(09:00~18:00)
      const fridayNightOpen = JSON.stringify([
        '',
        '',
        '',
        '0900',
        '2000',
        '',
        '',
        '',
      ]);
      const fridayNightClose = JSON.stringify([
        '',
        '',
        '',
        '1800',
        '0200',
        '',
        '',
        '',
      ]);

      // 금요일 새벽 01:30에는 금요일 밤 스케줄 때문에 영업중이 되면 안 됨
      expect(
        isPharmacyOpenNow(fridayNightOpen, fridayNightClose, fridayDawn),
      ).toBe(false);
      // 금요일 19:59에는 아직 시작 전
      expect(
        isPharmacyOpenNow(fridayNightOpen, fridayNightClose, fridayBeforeOpen),
      ).toBe(false);
      // 금요일 20:00 정각부터 영업 시작
      expect(
        isPharmacyOpenNow(fridayNightOpen, fridayNightClose, fridayOpen),
      ).toBe(true);
      // 금요일 23:59 영업 유지
      expect(
        isPharmacyOpenNow(fridayNightOpen, fridayNightClose, fridayLateNight),
      ).toBe(true);
    });

    it('전날(목요일) 심야 영업(20:00~익일 02:00)은 금요일 새벽에 정상 승계되어 영업중이어야 한다', () => {
      // 2026-09-18은 평일 금요일
      const fridayDawn30 = new Date(2026, 8, 18, 0, 30); // 금요일 00:30
      const fridayDawn90 = new Date(2026, 8, 18, 1, 30); // 금요일 01:30
      const fridayDawnClose = new Date(2026, 8, 18, 2, 0); // 금요일 02:00
      const fridayDawnAfterClose = new Date(2026, 8, 18, 2, 1); // 금요일 02:01

      // 목요일(인덱스 3) 20:00 ~ 02:00 심야 영업, 금요일(인덱스 4)은 휴무
      const thursdayOvernightOpen = JSON.stringify([
        '',
        '',
        '',
        '2000',
        '',
        '',
        '',
        '',
      ]);
      const thursdayOvernightClose = JSON.stringify([
        '',
        '',
        '',
        '0200',
        '',
        '',
        '',
        '',
      ]);

      // 목요일 연장 새벽 구간 정상 인정
      expect(
        isPharmacyOpenNow(
          thursdayOvernightOpen,
          thursdayOvernightClose,
          fridayDawn30,
        ),
      ).toBe(true);
      expect(
        isPharmacyOpenNow(
          thursdayOvernightOpen,
          thursdayOvernightClose,
          fridayDawn90,
        ),
      ).toBe(true);
      expect(
        isPharmacyOpenNow(
          thursdayOvernightOpen,
          thursdayOvernightClose,
          fridayDawnClose,
        ),
      ).toBe(true);
      // 02:01은 영업 종료
      expect(
        isPharmacyOpenNow(
          thursdayOvernightOpen,
          thursdayOvernightClose,
          fridayDawnAfterClose,
        ),
      ).toBe(false);
    });

    it('일반 주간 영업(09:00~18:00)의 경계값을 정확히 판별해야 한다', () => {
      // 2026-09-21은 월요일
      const t0859 = new Date(2026, 8, 21, 8, 59);
      const t0900 = new Date(2026, 8, 21, 9, 0);
      const t1200 = new Date(2026, 8, 21, 12, 0);
      const t1800 = new Date(2026, 8, 21, 18, 0);
      const t1801 = new Date(2026, 8, 21, 18, 1);

      expect(isPharmacyOpenNow(openTimes, closeTimes, t0859)).toBe(false);
      expect(isPharmacyOpenNow(openTimes, closeTimes, t0900)).toBe(true);
      expect(isPharmacyOpenNow(openTimes, closeTimes, t1200)).toBe(true);
      expect(isPharmacyOpenNow(openTimes, closeTimes, t1800)).toBe(true);
      expect(isPharmacyOpenNow(openTimes, closeTimes, t1801)).toBe(false);
    });

    it('24시간 영업 약국은 언제나 true를 반환해야 한다', () => {
      const dawn = new Date(2026, 8, 22, 3, 0); // 03:00
      const fullOpen = JSON.stringify([
        '0000',
        '0000',
        '0000',
        '0000',
        '0000',
        '0000',
        '0000',
        '0000',
      ]);
      const fullClose = JSON.stringify([
        '2400',
        '2400',
        '2400',
        '2400',
        '2400',
        '2400',
        '2400',
        '2400',
      ]);
      expect(isPharmacyOpenNow(fullOpen, fullClose, dawn)).toBe(true);
    });

    it('영업 정보가 없는 요일에는 false를 반환해야 한다', () => {
      const sundayNoon = new Date(2026, 8, 27, 12, 0); // 일요일
      expect(isPharmacyOpenNow(openTimes, closeTimes, sundayNoon)).toBe(false);
    });

    it('휴무 데이터 [0000, 0000]인 경우 영업중으로 판정되지 않아야 한다', () => {
      const mondayNoon = new Date(2026, 8, 21, 12, 0);
      const zeroOpen = JSON.stringify(['0000', '', '', '', '', '', '', '']);
      const zeroClose = JSON.stringify(['0000', '', '', '', '', '', '', '']);
      expect(isPharmacyOpenNow(zeroOpen, zeroClose, mondayNoon)).toBe(false);
    });
  });

  describe('휴무일 UI 텍스트 및 포맷팅 테스트', () => {
    it('0000 시작/종료 데이터는 휴무로 표시되어야 한다', () => {
      const sunday = new Date(2026, 8, 27, 12, 0); // 일요일 (인덱스 6)
      const openTimes = JSON.stringify([
        '0900',
        '0900',
        '0900',
        '0900',
        '0900',
        '0900',
        '0000',
        '',
      ]);
      const closeTimes = JSON.stringify([
        '1800',
        '1800',
        '1800',
        '1800',
        '1800',
        '1800',
        '0000',
        '',
      ]);

      const summary = getTodayBusinessHourSummary(
        openTimes,
        closeTimes,
        sunday,
      );
      expect(summary.label).toBe('일요일');
      expect(summary.text).toBe('휴무');
      expect(summary.hasHours).toBe(false);

      const hours = parsePharmacyBusinessHours(openTimes, closeTimes, sunday);
      const sundayItem = hours.find((h) => h.dayIndex === 6);
      expect(sundayItem?.timeText).toBe('휴무');
    });

    it('빈 문자열 시작/종료 데이터도 휴무로 표시되어야 한다', () => {
      const sunday = new Date(2026, 8, 27, 12, 0);
      const openTimes = JSON.stringify([
        '0900',
        '0900',
        '0900',
        '0900',
        '0900',
        '0900',
        '',
        '',
      ]);
      const closeTimes = JSON.stringify([
        '1800',
        '1800',
        '1800',
        '1800',
        '1800',
        '1800',
        '',
        '',
      ]);

      const summary = getTodayBusinessHourSummary(
        openTimes,
        closeTimes,
        sunday,
      );
      expect(summary.label).toBe('일요일');
      expect(summary.text).toBe('휴무');
      expect(summary.hasHours).toBe(false);
    });

    it('0000과 0030처럼 실제 영업시간인 경우는 휴무가 아닌 시간 범위로 표시되어야 한다', () => {
      const monday = new Date(2026, 8, 21, 12, 0);
      const openTimes = JSON.stringify(['0000', '', '', '', '', '', '', '']);
      const closeTimes = JSON.stringify(['0030', '', '', '', '', '', '', '']);

      const summary = getTodayBusinessHourSummary(
        openTimes,
        closeTimes,
        monday,
      );
      expect(summary.text).toBe('00:00 ~ 00:30');
      expect(summary.hasHours).toBe(true);
    });
  });
});
