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
  // 라벨 (예: '오늘 영업')
  label: string;

  // 표시 텍스트 (예: '09:00 ~ 18:00' 또는 '정보 없음')
  text: string;

  // 유효한 영업시간 존재 여부
  hasHours: boolean;
}

// 약국 영업시간 요약 클릭 행 Props
export interface IPharmacyHoursHeaderRowProps {
  // 라벨 (예: '오늘 영업')
  label: string;

  // 표시 텍스트
  text: string;

  // 확장(펼침) 상태 여부
  isExpanded: boolean;

  // 확장 토글 핸들러
  onToggle: () => void;
}

// 약국 확장 영업시간 리스트 Props
export interface IPharmacyExpandedHoursListProps {
  // 요일별 영업시간 데이터 목록
  businessHours: IPharmacyBusinessHourItem[];
}

// 약국 영업시간 개별 행 컴포넌트 Props
export interface IPharmacyBusinessHourRowProps {
  // 요일별 영업시간 데이터
  item: IPharmacyBusinessHourItem;
}

// 약국 데이터 출처 푸터 컴포넌트 Props
export interface IPharmacyDataSourceFooterProps {
  // 표시할 출처 텍스트 (기본값: PHARMACY_DATA_SOURCE_TEXT)
  sourceText?: string;
}

// 지금 열려있는 약국만 보기 체크박스 컴포넌트 Props
export interface IPharmacyOpenOnlyCheckboxProps {
  // 체크 여부
  checked: boolean;

  // 체크 토글 핸들러
  onToggle: () => void;
}
