import type { GuideStep, Rect } from '../types/guide_type';
import {
  TOOLTIP_GAP,
  ESTIMATED_CARD_HEIGHT,
  TOOLTIP_MARGIN,
  TOOLTIP_PADDING_H,
} from '../constants/guide_tooltip_constant';
import { computeCutout, resolveTooltipSide } from './guide_measure';

export interface TooltipLayout {
  cutout: Rect;
  isCircle: boolean;
  circleCenter: { x: number; y: number };
  circleRadius: number;
  side: 'top' | 'bottom';
  top: number;
  slideWidth: number;
}

/**
 * 측정된 타겟 rect 와 카드 높이 등으로부터 오버레이가 그릴 컷아웃/말풍선 위치를 계산.
 * rect 가 아직 없으면 0 영역을 돌려주고, 카드 높이가 0이면 폴백 추정치를 사용한다.
 */
export function computeTooltipLayout(args: {
  rect: Rect | null;
  cardHeight: number;
  step: GuideStep;
  windowWidth: number;
  windowHeight: number;
  insetTop: number;
  insetBottom: number;
  defaultPadding: number;
}): TooltipLayout {
  const {
    rect,
    cardHeight,
    step,
    windowWidth,
    windowHeight,
    insetTop,
    insetBottom,
    defaultPadding,
  } = args;

  const padding = step.padding ?? defaultPadding;
  const cutout: Rect = rect
    ? computeCutout(rect, padding)
    : { x: 0, y: 0, width: 0, height: 0 };

  const isCircle = step.shape === 'circle';
  const circleCenter = {
    x: cutout.x + cutout.width / 2,
    y: cutout.y + cutout.height / 2,
  };
  const circleRadius = Math.max(cutout.width, cutout.height) / 2;

  const side = rect
    ? resolveTooltipSide(cutout, windowHeight, step.tooltipPosition)
    : 'bottom';

  const estHeight = cardHeight || ESTIMATED_CARD_HEIGHT;
  const rawTop =
    side === 'bottom'
      ? cutout.y + cutout.height + TOOLTIP_GAP
      : cutout.y - TOOLTIP_GAP - estHeight;
  const top = Math.max(
    insetTop + 8,
    Math.min(rawTop, windowHeight - insetBottom - estHeight - 8),
  );

  const slideWidth = windowWidth - TOOLTIP_MARGIN * 2 - TOOLTIP_PADDING_H * 2;

  return {
    cutout,
    isCircle,
    circleCenter,
    circleRadius,
    side,
    top,
    slideWidth,
  };
}
