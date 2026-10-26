import { useCallback, useEffect, useRef, useState } from 'react';
import { View, LayoutChangeEvent, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  getTargetRef,
  subscribeTargetLayoutChange,
} from '../store/guide_target_registry';
import { getScrollController } from '../store/guide_scroll_registry';
import {
  MEASURE_RETRY_INTERVAL_MS,
  MEASURE_MAX_RETRIES,
  SCROLL_SETTLE_MS,
  TOP_SAFE_OFFSET,
  BOTTOM_SAFE_OFFSET,
  SCROLL_DESIRED_WINDOW_OFFSET,
} from '../constants/guide_measure_constant';
import type { GuideStep, Rect } from '../types/guide_type';

export interface UseGuideMeasureResult {
  overlayRef: React.MutableRefObject<View | null>;
  rect: Rect | null;
  cardHeight: number;
  onCardLayout: (e: LayoutChangeEvent) => void;
  windowWidth: number;
  windowHeight: number;
  insetTop: number;
  insetBottom: number;
}

function rectEquals(a: Rect | null, b: Rect | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
  );
}

/**
 * 활성 스텝의 타겟을 측정하고, off-screen 이면 등록된 스크롤뷰로 자동 스크롤 후 재측정한다.
 *
 * 재측정이 트리거되는 조건:
 * - 스텝 전환 / 윈도우 치수 변경 / safe-area 변경
 * - 활성 타겟의 `onLayout` — 콘텐츠 로딩, 키보드, 폰트 지연, 애니메이션 종료 등으로
 *   타겟 크기·위치가 바뀌면 `GuideTarget` 이 notifier 를 쏘고 여기서 받아 다시 측정한다.
 *   한 번 스크롤한 뒤의 재측정이므로 `scrolled` 플래그는 유지되어 재스크롤되지 않는다.
 *
 * 측정 결과가 이전과 동일하면 상태를 바꾸지 않아, 불필요한 re-render 와 말풍선 등장
 * 애니메이션 재시작을 막는다. 스크롤이 필요한 동안은 rect/cardHeight 를 비워 깜빡임 방지.
 */
export function useGuideMeasure(
  step: GuideStep | null,
  stepIndex: number,
): UseGuideMeasureResult {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const insetTop = insets.top;
  const insetBottom = insets.bottom;

  const overlayRef = useRef<View | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [cardHeight, setCardHeight] = useState(0);

  useEffect(() => {
    if (!step) {
      setRect((prev) => (prev === null ? prev : null));
      return;
    }

    let tries = 0;
    let scrolled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const measure = () => {
      const node = getTargetRef(step.id)?.current;
      const overlayNode = overlayRef.current;

      if (!node || !overlayNode) {
        if (tries++ < MEASURE_MAX_RETRIES) {
          timer = setTimeout(measure, MEASURE_RETRY_INTERVAL_MS);
        }
        return;
      }

      overlayNode.measureInWindow((ox, oy) => {
        node.measureInWindow((x, y, w, h) => {
          if (w === 0 && h === 0 && tries++ < MEASURE_MAX_RETRIES) {
            timer = setTimeout(measure, MEASURE_RETRY_INTERVAL_MS);
            return;
          }

          const controller = getScrollController();
          const topLimit = oy + insetTop + TOP_SAFE_OFFSET;
          const bottomLimit =
            oy + windowHeight - insetBottom - BOTTOM_SAFE_OFFSET;
          const offscreen = y < topLimit || y + h > bottomLimit;

          if (controller && offscreen && !scrolled) {
            scrolled = true;
            setRect((prev) => (prev === null ? prev : null));
            setCardHeight((prev) => (prev === 0 ? prev : 0));
            const desiredWindowY = oy + insetTop + SCROLL_DESIRED_WINDOW_OFFSET;
            const newScrollY = controller.getOffsetY() + (y - desiredWindowY);
            controller.scrollTo(newScrollY);
            timer = setTimeout(measure, SCROLL_SETTLE_MS);
            return;
          }

          const next: Rect = { x: x - ox, y: y - oy, width: w, height: h };
          setRect((prev) => (rectEquals(prev, next) ? prev : next));
        });
      });
    };

    measure();

    const unsubscribe = subscribeTargetLayoutChange(step.id, measure);

    return () => {
      unsubscribe();
      if (timer) clearTimeout(timer);
    };
  }, [step, stepIndex, windowWidth, windowHeight, insetTop, insetBottom]);

  const onCardLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    setCardHeight((prev) => (prev === h ? prev : h));
  }, []);

  return {
    overlayRef,
    rect,
    cardHeight,
    onCardLayout,
    windowWidth,
    windowHeight,
    insetTop,
    insetBottom,
  };
}
