// 위도 1도 ≒ 111km, 경도 1도 ≒ 88km (한국 위도 기준)
export const KM_PER_LAT_DEGREE = 111;
export const KM_PER_LON_DEGREE = 88;

// 기본 약국 검색 반경 (고정 3km)
export const NEARBY_PHARMACY_RADIUS_KM = 3;
export const DEFAULT_SEARCH_RADIUS_KM = 3;

// 검색 건수 제한 (후보군 최대 조회 건수 및 페이지당 기본 건수)
export const CANDIDATE_SEARCH_LIMIT = 300;
export const DEFAULT_PAGE_SIZE_LIMIT = 50;

// 위치 센서 / GPS 캐시 및 타임아웃 정책
export const BALANCED_TIMEOUT_MS = 6000;
export const LOW_TIMEOUT_MS = 4000;
export const LOCATION_CACHE_MAX_AGE_MS = 5 * 60 * 1000;

// 지도 이동 시 재검색 트리거 임계값
export const RESEARCH_DISPLACEMENT_RATIO = 0.2;
export const RESEARCH_MAX_DISPLACEMENT_KM = 1;
export const LOCATION_REFRESH_MIN_DISTANCE_M = 100;
