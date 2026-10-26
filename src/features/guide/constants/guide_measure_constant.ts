// 타겟 측정 재시도 간격 / 최대 재시도 횟수 (레이아웃 지연 대비)
export const MEASURE_RETRY_INTERVAL_MS = 50;
export const MEASURE_MAX_RETRIES = 20;

// 스크롤 완료 대기 시간 (스크롤 애니메이션이 끝난 뒤 재측정)
export const SCROLL_SETTLE_MS = 360;

// 타겟이 "화면에 보이는지" 판단하기 위한 상/하단 안전 여백
export const TOP_SAFE_OFFSET = 72;
export const BOTTOM_SAFE_OFFSET = 96;

// 스크롤 후 타겟을 상단에서 얼마나 떨어진 위치에 두고 싶은지
export const SCROLL_DESIRED_WINDOW_OFFSET = 150;
