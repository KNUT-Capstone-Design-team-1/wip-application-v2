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
} as const;

// 동기화 단계별 통합 UI 상태 메시지
export const SYNC_PHASE_STATUS = {
  PREPARING: '데이터 동기화 준비 중',
  DOWNLOADING: '최신 데이터 다운로드 중...',
  VALIDATING: '데이터 무결성 검증 중...',
  APPLYING: '데이터베이스 적용 중...',
  COMPLETED: '업데이트 완료',
  FAILED: '데이터 동기화 실패',
} as const;
