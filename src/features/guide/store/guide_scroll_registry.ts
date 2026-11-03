/**
 * off-screen 타겟을 화면 안으로 끌어오기 위한 **스크롤 컨트롤러 싱글톤**.
 *
 * - 투어는 전역 1개뿐이므로 컨트롤러도 전역 1개
 * - `useGuideScroll` 이 포커스된 화면의 ScrollView 를 등록 → 블러 시 해제
 * - 측정 로직(`useGuideMeasure`)이 off-screen 판단되면 여기 등록된 컨트롤러로 스크롤
 */
export interface ScrollController {
  /** 지정 Y 로 스크롤 (음수는 0 으로 보정됨) */
  scrollTo: (y: number) => void;
  /** 현재 ScrollView 의 contentOffset.y */
  getOffsetY: () => number;
}

let scrollController: ScrollController | null = null;

/** 등록 — 같은 세션에 여러 ScrollView 가 있으면 마지막 등록이 이김 */
export function setScrollController(c: ScrollController) {
  scrollController = c;
}

/**
 * 해제 — 자기가 등록한 컨트롤러일 때만 지움.
 * (스택 네비게이션에서 blur 된 화면이 뒤늦게 cleanup 돌 때 새 컨트롤러를 날리지 않도록)
 */
export function clearScrollController(c: ScrollController) {
  if (scrollController === c) {
    scrollController = null;
  }
}

/** 측정 로직에서 조회. 등록된 ScrollView 가 없으면 `null` → 스크롤 보정 생략 */
export function getScrollController(): ScrollController | null {
  return scrollController;
}
