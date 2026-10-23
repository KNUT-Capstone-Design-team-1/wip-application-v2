// 투어가 off-screen 타겟을 화면 안으로 끌어오기 위한 스크롤 컨트롤러 싱글톤
export interface ScrollController {
  scrollTo: (y: number) => void;
  getOffsetY: () => number;
}

let scrollController: ScrollController | null = null;

export function setScrollController(c: ScrollController) {
  scrollController = c;
}

export function clearScrollController(c: ScrollController) {
  if (scrollController === c) {
    scrollController = null;
  }
}

export function getScrollController(): ScrollController | null {
  return scrollController;
}
