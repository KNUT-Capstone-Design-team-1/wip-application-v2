import {
  isKoreanPublicHoliday,
  getKoreanHolidayName,
  getKoreanHolidaysForYear,
} from '@features/nearby_pharmacy/utils/korean_holidays';
import {
  getTodayIndex,
  getTodayBusinessHourSummary,
  isPharmacyOpenNow,
} from '@features/nearby_pharmacy/utils/business_hours';

describe('대한민국 법정 공휴일 계산기 (korean_holidays) 테스트', () => {
  describe('2026년 공휴일 계산', () => {
    it('양력 고정 공휴일을 정확히 판별해야 한다', () => {
      // 2026-01-01 신정
      expect(isKoreanPublicHoliday(new Date(2026, 0, 1))).toBe(true);
      expect(getKoreanHolidayName(new Date(2026, 0, 1))).toBe('신정');

      // 2026-03-01 3·1절
      expect(isKoreanPublicHoliday(new Date(2026, 2, 1))).toBe(true);

      // 2026-05-05 어린이날
      expect(isKoreanPublicHoliday(new Date(2026, 4, 5))).toBe(true);

      // 2026-06-06 현충일
      expect(isKoreanPublicHoliday(new Date(2026, 5, 6))).toBe(true);

      // 2026-08-15 광복절
      expect(isKoreanPublicHoliday(new Date(2026, 7, 15))).toBe(true);

      // 2026-10-03 개천절
      expect(isKoreanPublicHoliday(new Date(2026, 9, 3))).toBe(true);

      // 2026-10-09 한글날
      expect(isKoreanPublicHoliday(new Date(2026, 9, 9))).toBe(true);

      // 2026-12-25 성탄절
      expect(isKoreanPublicHoliday(new Date(2026, 11, 25))).toBe(true);
    });

    it('음력 명절(설날 연휴, 추석 연휴, 부처님오신날)을 정확히 판별해야 한다', () => {
      // 2026년 설날: 2026-02-17 (연휴: 02-16 ~ 02-18)
      expect(isKoreanPublicHoliday(new Date(2026, 1, 16))).toBe(true);
      expect(isKoreanPublicHoliday(new Date(2026, 1, 17))).toBe(true);
      expect(isKoreanPublicHoliday(new Date(2026, 1, 18))).toBe(true);

      // 2026년 부처님오신날 (음력 4.8): 2026-05-24 (일요일)
      expect(isKoreanPublicHoliday(new Date(2026, 4, 24))).toBe(true);

      // 2026년 추석: 2026-09-25 (연휴: 09-24 ~ 09-26)
      expect(isKoreanPublicHoliday(new Date(2026, 8, 24))).toBe(true);
      expect(isKoreanPublicHoliday(new Date(2026, 8, 25))).toBe(true);
      expect(isKoreanPublicHoliday(new Date(2026, 8, 26))).toBe(true);
    });

    it('주말과 겹친 공휴일의 대체공휴일을 정확히 계산해야 한다', () => {
      // 2026-03-01(일) 3·1절 -> 2026-03-02(월) 대체공휴일
      expect(isKoreanPublicHoliday(new Date(2026, 2, 2))).toBe(true);
      expect(getKoreanHolidayName(new Date(2026, 2, 2))).toContain(
        '대체공휴일',
      );

      // 2026-05-24(일) 부처님오신날 -> 2026-05-25(월) 대체공휴일
      expect(isKoreanPublicHoliday(new Date(2026, 4, 25))).toBe(true);

      // 2026-08-15(토) 광복절 -> 2026-08-17(월) 대체공휴일
      expect(isKoreanPublicHoliday(new Date(2026, 7, 17))).toBe(true);

      // 2026-10-03(토) 개천절 -> 2026-10-05(월) 대체공휴일
      expect(isKoreanPublicHoliday(new Date(2026, 9, 5))).toBe(true);
    });

    it('일반 평일은 공휴일이 아니어야 한다', () => {
      // 2026-09-23 수요일 평일
      expect(isKoreanPublicHoliday(new Date(2026, 8, 23))).toBe(false);
      expect(getKoreanHolidayName(new Date(2026, 8, 23))).toBeNull();
    });
  });

  describe('약국 영업시간 연동 (getTodayIndex & isPharmacyOpenNow)', () => {
    it('공휴일에는 getTodayIndex가 7(공휴일 인덱스)을 반환해야 한다', () => {
      const nationalHoliday = new Date(2026, 7, 15); // 광복절
      expect(getTodayIndex(nationalHoliday)).toBe(7);

      const substituteHoliday = new Date(2026, 7, 17); // 광복절 대체공휴일
      expect(getTodayIndex(substituteHoliday)).toBe(7);

      const ordinaryMonday = new Date(2026, 8, 21); // 평일 월요일
      expect(getTodayIndex(ordinaryMonday)).toBe(0);
    });

    it('공휴일 당일에는 7번째 인덱스(공휴일 영업시간)를 기준으로 영업 상태를 판별해야 한다', () => {
      const holidayNoon = new Date(2026, 7, 15, 11, 0); // 광복절 11:00
      // 월~일은 모두 09:00~18:00, 공휴일(인덱스 7)만 09:00~13:00 영업
      const openTimes = JSON.stringify([
        '0900',
        '0900',
        '0900',
        '0900',
        '0900',
        '0900',
        '0900',
        '0900',
      ]);
      const closeTimes = JSON.stringify([
        '1800',
        '1800',
        '1800',
        '1800',
        '1800',
        '1800',
        '1800',
        '1300',
      ]);

      // 11:00에는 공휴일 영업시간(09:00~13:00) 내이므로 영업중
      expect(isPharmacyOpenNow(openTimes, closeTimes, holidayNoon)).toBe(true);

      // 14:00에는 공휴일 영업 마감(13:00) 이후이므로 영업종료
      const holidayAfternoon = new Date(2026, 7, 15, 14, 0);
      expect(isPharmacyOpenNow(openTimes, closeTimes, holidayAfternoon)).toBe(
        false,
      );
    });

    it('공휴일 당일 요약 정보는 공휴일 레이블과 해당 시간을 표시해야 한다', () => {
      const holidayDate = new Date(2026, 7, 15, 10, 0); // 광복절
      const openTimes = JSON.stringify([
        '0900',
        '0900',
        '0900',
        '0900',
        '0900',
        '0900',
        '0900',
        '1000',
      ]);
      const closeTimes = JSON.stringify([
        '1800',
        '1800',
        '1800',
        '1800',
        '1800',
        '1800',
        '1800',
        '1400',
      ]);

      const summary = getTodayBusinessHourSummary(
        openTimes,
        closeTimes,
        holidayDate,
      );
      expect(summary.label).toBe('공휴일');
      expect(summary.text).toBe('10:00 ~ 14:00');
      expect(summary.hasHours).toBe(true);
    });
  });
});
