import {
  isPharmacyOpenNow,
  parsePharmacyBusinessHours,
  getTodayBusinessHourSummary,
  formatPharmacyTime,
  parseTimeToMinutes,
} from '@features/nearby_pharmacy/utils/business_hours';

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
  });
});
