// 위도 1도 ≒ 111km, 경도 1도 ≒ 88km (한국 위도 기준)
export const KM_PER_LAT_DEGREE = 111;
export const KM_PER_LON_DEGREE = 88;

// 검색 반경 (고정)
export const NEARBY_PHARMACY_RADIUS_KM = 3;

// 클러스터 병합 반경 (px). 값이 클수록 더 넓게 묶임
export const CLUSTER_RADIUS_PX = 60;
// 이 zoom level 이상에선 클러스터 해제 (개별 마커 표시)
export const CLUSTER_MAX_ZOOM = 18;
// 최소 이 개수부터 클러스터로 묶음
export const CLUSTER_MIN_POINTS = 2;

// 자동 재검색 임계값: min(뷰 세로 폭 * RATIO, MAX_KM) 중 먼저 걸리는 쪽
// - zoom in 상태에선 RATIO가 먼저 걸려 세밀한 팬에도 반응
// - zoom out 상태에선 MAX_KM 상한이 걸려 어느 zoom이든 1km 이상 팬 시 재검색
export const RESEARCH_DISPLACEMENT_RATIO = 0.2;
export const RESEARCH_MAX_DISPLACEMENT_KM = 1;
