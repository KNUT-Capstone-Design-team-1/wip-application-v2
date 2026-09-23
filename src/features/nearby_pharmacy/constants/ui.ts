import { px } from '@utils/responsive';

// 클러스터 약국 리스트 높이
export const CLUSTER_LIST_MAX_HEIGHT = px(200);

// 약국 상세 정보 카드 높이
export const PHARMACY_INFO_CARD_MAX_HEIGHT = px(250);

// 요일 레이블 상수 (0: 월요일 ~ 7: 공휴일)
export const PHARMACY_DAY_LABELS = [
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
  '일요일',
  '공휴일',
] as const;

// 약국 데이터 출처 안내 문구
export const PHARMACY_DATA_SOURCE_TEXT =
  '출처: 약국 오픈 API Data (생활안전정보)';

// 재고 문의 라우트
export const STOCK_INQUIRY_ROUTE = '/nearby-pharmacy-inquiry' as const;

// 재고 문의 모달 안내 문구
export const STOCK_INQUIRY_MODAL = {
  title: '약국 재고 문의',
  message:
    '약국에 재고를 문의하시겠습니까?\n\n확인을 누르면 주변 약국을 탐색하고 전화를 통해 재고를 문의하실 수 있습니다.',
  confirmText: '확인',
  cancelText: '취소',
} as const;

// 약국 관련 토스트 안내 문구
export const PHARMACY_TOAST_MESSAGES = {
  NO_OPEN_PHARMACY: '현재 영업 중인 주변 약국이 없습니다.',
  OPEN_PHARMACY_COUNT: (count: number) =>
    `영업 중인 약국 ${count}곳을 표시합니다.`,
  ALL_PHARMACIES: '전체 약국을 표시합니다.',
} as const;
