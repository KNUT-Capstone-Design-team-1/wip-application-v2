// 개별 요일 영업시간 모델 인터페이스
export interface IPharmacyBusinessHourItem {
  // 요일명 ('월요일', '화요일', ..., '공휴일')
  dayLabel: string;

  // 인덱스 (0: 월요일 ~ 7: 공휴일)
  dayIndex: number;

  // 포맷팅된 시작 시간 (예: '09:00' 또는 '')
  openTime: string;

  // 포맷팅된 종료 시간 (예: '18:00' 또는 '')
  closeTime: string;

  // UI 표시용 시간 문자열 (예: '09:00 ~ 18:00' 또는 '정보 없음')
  timeText: string;

  // 오늘 요일 여부
  isToday: boolean;

  // 공휴일 여부
  isHoliday: boolean;

  // 주말 여부 (토/일)
  isWeekend: boolean;
}

// 오늘 영업시간 요약 인터페이스
export interface IPharmacyBusinessHourSummary {
  // 라벨 (예: '월요일', '화요일')
  label: string;

  // 표시 텍스트 (예: '09:00 ~ 18:00' 또는 '정보 없음')
  text: string;

  // 유효한 영업시간 존재 여부
  hasHours: boolean;
}
