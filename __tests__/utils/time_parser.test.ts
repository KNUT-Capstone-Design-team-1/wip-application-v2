import {
  parseTimeJsonArray,
  formatPharmacyTime,
  parseTimeToMinutes,
  isBlankOrZeroTime,
} from '@features/nearby_pharmacy/utils/time_parser';

describe('time_parser 유틸리티 테스트', () => {
  describe('parseTimeJsonArray', () => {
    it('표준 JSON 배열 문자열을 파싱해야 한다', () => {
      const json = JSON.stringify(['0900', '1800', '1900']);
      expect(parseTimeJsonArray(json)).toEqual(['0900', '1800', '1900']);
    });

    it('파이썬 형태의 작은따옴표 리스트 문자열을 파싱해야 한다', () => {
      const pythonStr = "['0900', '1800', '']";
      expect(parseTimeJsonArray(pythonStr)).toEqual(['0900', '1800', '']);
    });

    it('동일한 문자열 입력 시 캐시된 결과를 반환해야 한다 (메모이제이션 검증)', () => {
      const json = JSON.stringify(['0900', '1800']);
      const first = parseTimeJsonArray(json);
      const second = parseTimeJsonArray(json);
      expect(first).toBe(second); // 동일 객체 참조 확인
    });

    it('null, undefined, 빈 문자열이면 빈 배열을 반환해야 한다', () => {
      expect(parseTimeJsonArray(null)).toEqual([]);
      expect(parseTimeJsonArray(undefined)).toEqual([]);
      expect(parseTimeJsonArray('')).toEqual([]);
      expect(parseTimeJsonArray('   ')).toEqual([]);
    });

    it('이미 배열인 경우 각 요소를 trim된 문자열로 반환해야 한다', () => {
      expect(parseTimeJsonArray([' 0900 ', 1800, null])).toEqual([
        '0900',
        '1800',
        '',
      ]);
    });
  });

  describe('formatPharmacyTime', () => {
    it('4자리 숫자 문자열을 시:분 형태로 변환해야 한다', () => {
      expect(formatPharmacyTime('0900')).toBe('09:00');
      expect(formatPharmacyTime('1830')).toBe('18:30');
      expect(formatPharmacyTime('0000')).toBe('00:00');
    });

    it('3자리 숫자 문자열(900 등)을 09:00 형태로 패딩하여 변환해야 한다', () => {
      expect(formatPharmacyTime('900')).toBe('09:00');
    });

    it('빈 값이면 빈 문자열을 반환해야 한다', () => {
      expect(formatPharmacyTime('')).toBe('');
      expect(formatPharmacyTime(null)).toBe('');
      expect(formatPharmacyTime(undefined)).toBe('');
    });
  });

  describe('parseTimeToMinutes', () => {
    it('시간 문자열을 자정 기준 분 단위로 변환해야 한다', () => {
      expect(parseTimeToMinutes('0000')).toBe(0);
      expect(parseTimeToMinutes('0900')).toBe(540);
      expect(parseTimeToMinutes('09:30')).toBe(570);
      expect(parseTimeToMinutes('1800')).toBe(1080);
      expect(parseTimeToMinutes('2400')).toBe(1440);
    });

    it('동일한 문자열 입력 시 캐시에서 즉시 반환해야 한다', () => {
      expect(parseTimeToMinutes('0900')).toBe(540);
      expect(parseTimeToMinutes('0900')).toBe(540);
    });

    it('유효하지 않은 형식이면 null을 반환해야 한다', () => {
      expect(parseTimeToMinutes('')).toBeNull();
      expect(parseTimeToMinutes(null)).toBeNull();
      expect(parseTimeToMinutes('invalid')).toBeNull();
      expect(parseTimeToMinutes('2500')).toBeNull();
      expect(parseTimeToMinutes('1260')).toBeNull();
    });
  });

  describe('isBlankOrZeroTime', () => {
    it('빈 값, null, undefined에 대해 true를 반환해야 한다', () => {
      expect(isBlankOrZeroTime('')).toBe(true);
      expect(isBlankOrZeroTime('  ')).toBe(true);
      expect(isBlankOrZeroTime(null)).toBe(true);
      expect(isBlankOrZeroTime(undefined)).toBe(true);
    });

    it('0000, 00:00, 0 등 0으로만 구성된 값에 대해 true를 반환해야 한다', () => {
      expect(isBlankOrZeroTime('0000')).toBe(true);
      expect(isBlankOrZeroTime('00:00')).toBe(true);
      expect(isBlankOrZeroTime('0')).toBe(true);
    });

    it('실제 영업 시간 값이 포함되어 있으면 false를 반환해야 한다', () => {
      expect(isBlankOrZeroTime('0900')).toBe(false);
      expect(isBlankOrZeroTime('0030')).toBe(false);
      expect(isBlankOrZeroTime('1800')).toBe(false);
    });
  });
});
