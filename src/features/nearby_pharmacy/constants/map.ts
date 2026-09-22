import markerUnselected from '@assets/images/map/marker_unselected.png';
import markerSelected from '@assets/images/map/marker_selected.png';
import { px } from '@utils/responsive';

// 기본 지도 중심 좌표 (서울시청 기준)
export const DEFAULT_MAP_LATITUDE = 37.5665;
export const DEFAULT_MAP_LONGITUDE = 126.978;

// 지도 줌 레벨별 델타 (기본 / 상세 / 대체)
export const DEFAULT_LATITUDE_DELTA = 0.01;
export const DEFAULT_LONGITUDE_DELTA = 0.01;
export const DETAIL_LATITUDE_DELTA = 0.0025;
export const DETAIL_LONGITUDE_DELTA = 0.0025;
export const FALLBACK_LATITUDE_DELTA = 0.05;
export const FALLBACK_LONGITUDE_DELTA = 0.05;

// 지도 카메라 이동 애니메이션 지속 시간 (ms)
export const MAP_CAMERA_ANIMATE_DURATION_MS = 300;

// 클러스터링 설정 (반경 px, 최대 줌 레벨, 최소 포인트 수, 잎 노드 제한)
export const CLUSTER_RADIUS_PX = 60;
export const CLUSTER_MAX_ZOOM = 18;
export const CLUSTER_MIN_POINTS = 2;
export const CLUSTER_LEAF_LIMIT = 100;

// 마커 비주얼 및 앵커 설정
export const MARKER_CLUSTER_SIZE = Math.round(px(32));
export const MARKER_ANCHOR_UNSELECTED = { x: 0.5, y: 0.5 } as const;
export const MARKER_ANCHOR_SELECTED = { x: 0.5, y: 1 } as const;
export const MARKER_Z_INDEX_SELECTED = 999;
export const MARKER_Z_INDEX_UNSELECTED = 1;
export const MARKER_TRACKS_CHANGES_TIMEOUT_MS = 250;

// 마커 이미지 에셋
export const MARKER_UNSELECTED_IMAGE = markerUnselected;
export const MARKER_SELECTED_IMAGE = markerSelected;
