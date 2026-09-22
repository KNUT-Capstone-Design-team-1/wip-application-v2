// 위도 1도 ≒ 111km, 경도 1도 ≒ 88km (한국 위도 기준)
export const KM_PER_LAT_DEGREE = 111;
export const KM_PER_LON_DEGREE = 88;

// 검색 반경 (고정 3km)
export const NEARBY_PHARMACY_RADIUS_KM = 3;

// 클러스터 병합 반경 (px). 값이 클수록 더 넓게 묶임
export const CLUSTER_RADIUS_PX = 60;
// 이 zoom level 이상에선 클러스터 해제 (개별 마커 표시)
export const CLUSTER_MAX_ZOOM = 18;
// 최소 이 개수부터 클러스터로 묶음
export const CLUSTER_MIN_POINTS = 2;

// 자동 재검색 임계값: min(뷰 세로 폭 * RATIO, MAX_KM) 중 먼저 걸리는 쪽
export const RESEARCH_DISPLACEMENT_RATIO = 0.2;
export const RESEARCH_MAX_DISPLACEMENT_KM = 1;

// 기본 지도 중심 좌표 (서울시청 기준)
export const DEFAULT_MAP_LATITUDE = 37.5665;
export const DEFAULT_MAP_LONGITUDE = 126.978;
export const DEFAULT_LATITUDE_DELTA = 0.01;
export const DEFAULT_LONGITUDE_DELTA = 0.01;
export const FALLBACK_LATITUDE_DELTA = 0.05;
export const FALLBACK_LONGITUDE_DELTA = 0.05;
