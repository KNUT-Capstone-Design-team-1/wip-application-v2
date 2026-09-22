// 위치 서비스 관련 타임아웃 및 캐시 정책 상수

// Balanced(균형) 정밀도 위치 조회 타임아웃 (ms)
export const BALANCED_TIMEOUT_MS = 6000;

// Low(저전력/기지국) 정밀도 위치 조회 타임아웃 (ms)
export const LOW_TIMEOUT_MS = 4000;

// 캐시된 마지막 위치 유효 시간 (5분)
export const LOCATION_CACHE_MAX_AGE_MS = 5 * 60 * 1000;

// 최신 GPS 위치로 재검색을 트리거하기 위한 최소 이동 거리 (m)
export const LOCATION_REFRESH_MIN_DISTANCE_M = 100;

// 카메라 이동 애니메이션 지속 시간 (ms)
export const MAP_CAMERA_ANIMATE_DURATION_MS = 300;
