import type { Rect, TooltipPosition } from '../types/guide_type';

/**
 * 타겟 사각형에 패딩만큼 여백을 더한 **컷아웃(스포트라이트 구멍)** 영역.
 * SVG 마스크에서 "뚫릴" 범위이자, 말풍선 위치 계산의 기준.
 */
export function computeCutout(rect: Rect, padding: number): Rect {
  return {
    x: rect.x - padding,
    y: rect.y - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  };
}

/**
 * 말풍선을 타겟의 **위/아래** 중 어디에 둘지 결정.
 *
 * - `'top'` / `'bottom'`: 사용자가 강제 지정한 쪽을 그대로 사용
 * - `'auto'` (기본): 타겟이 화면 아래쪽에 있으면 `'top'`, 위쪽이면 `'bottom'`
 *   (= 공간이 더 넓은 쪽으로 자동 배치)
 */
export function resolveTooltipSide(
  cutout: Rect,
  screenHeight: number,
  preferred: TooltipPosition = 'auto',
): 'top' | 'bottom' {
  if (preferred === 'top') return 'top';
  if (preferred === 'bottom') return 'bottom';
  const centerY = cutout.y + cutout.height / 2;
  return centerY > screenHeight / 2 ? 'top' : 'bottom';
}
