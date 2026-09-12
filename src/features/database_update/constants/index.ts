import { TDataTable } from '@services/database/types';

// 데이터베이스 업데이트 관련 상수 정의

// 스토리지 키 상수
export const STORAGE_KEYS = {
  UPDATE_STATE: '@db_update_persisted_state',
} as const;

// 네트워크 및 다운로드 정책 상수
export const DOWNLOAD_CONFIG = {
  MAX_RETRY_COUNT: 3,
  RETRY_DELAY_MS: 300,
  DOWNLOAD_TIMEOUT_MS: 30000,
  MAX_CONCURRENT_DOWNLOADS: 4,
  // 테이블별 1회 요청 시 가져올 데이터 페이지 크기(Limit) 설정
  PAGE_LIMIT: {
    // 일반 테이블: 데이터 건수가 적어 네트워크 오버헤드를 최소화하기 위해 기본 5000개 요청
    DEFAULT: 5000,
    // 알약 데이터(pill_data): 대용량 데이터로 단일 응답 페이로드 크기를 줄이고, 백그라운드 전환 시 타임아웃 방지 및
    // 페이지 단위 캐싱/이어받기(Resume) 최적화를 위해 1500개씩 분할 요청
    PILL_DATA: 1500,
  },
} as const;

// 테이블에 적합한 페이지 다운로드 크기(Limit)를 반환하는 헬퍼 함수
export const getTablePageLimit = (table: TDataTable): number => {
  return table === 'pill_data'
    ? DOWNLOAD_CONFIG.PAGE_LIMIT.PILL_DATA
    : DOWNLOAD_CONFIG.PAGE_LIMIT.DEFAULT;
};

// 동기화 단계별 통합 UI 상태 메시지
export const SYNC_PHASE_STATUS = {
  PREPARING: '데이터 동기화 준비 중',
  DOWNLOADING: '최신 데이터 다운로드 중...',
  VALIDATING: '데이터 검증 중...',
  APPLYING: '최신 정보를 기기에 적용하는 중...',
  COMPLETED: '업데이트 완료',
  FAILED: '데이터 동기화 실패',
} as const;
