import { useCallback, useEffect, useRef, useState } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { getTargetRef } from '../store/guide_target_registry';
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
}

/**
 * 활성 스텝의 타겟을 측정하고, off-screen 이면 등록된 스크롤뷰로 자동 스크롤 후 재측정한다.
 * 스크롤이 필요한 동안은 rect/cardHeight 를 비워 이전 스텝의 하이라이트/말풍선 깜빡임을 막는다.
 */
export function useGuideMeasure(
  step: GuideStep | null,
  stepIndex: number,
  windowWidth: number,
  windowHeight: number,
  insets: EdgeInsets,
): UseGuideMeasureResult {
  const overlayRef = useRef<View | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [cardHeight, setCardHeight] = useState(0);

  useEffect(() => {
    if (!step) {
      setRect(null);
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

      // 오버레이 원점 기준으로 좌표 변환 (상태바/edge-to-edge 오프셋 상쇄)
      overlayNode.measureInWindow((ox, oy) => {
        node.measureInWindow((x, y, w, h) => {
          if (w === 0 && h === 0 && tries++ < MEASURE_MAX_RETRIES) {
            timer = setTimeout(measure, MEASURE_RETRY_INTERVAL_MS);
            return;
          }

          const controller = getScrollController();
          const topLimit = oy + insets.top + TOP_SAFE_OFFSET;
          const bottomLimit =
            oy + windowHeight - insets.bottom - BOTTOM_SAFE_OFFSET;
          const offscreen = y < topLimit || y + h > bottomLimit;

          if (controller && offscreen && !scrolled) {
            scrolled = true;
            // 스크롤이 필요한 경우: 이전 스텝의 말풍선/하이라이트를 먼저 숨기고
            // 스크롤 완료 후 재측정으로 올바른 위치에서 다시 표시한다 (깜빡임 방지)
            setRect(null);
            setCardHeight(0);
            const desiredWindowY =
              oy + insets.top + SCROLL_DESIRED_WINDOW_OFFSET;
            const newScrollY = controller.getOffsetY() + (y - desiredWindowY);
            controller.scrollTo(newScrollY);
            timer = setTimeout(measure, SCROLL_SETTLE_MS);
            return;
          }

          setRect({ x: x - ox, y: y - oy, width: w, height: h });
        });
      });
    };

    measure();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [step, stepIndex, windowWidth, windowHeight, insets.top, insets.bottom]);

  const onCardLayout = useCallback((e: LayoutChangeEvent) => {
    setCardHeight(e.nativeEvent.layout.height);
  }, []);

  return { overlayRef, rect, cardHeight, onCardLayout };
}
