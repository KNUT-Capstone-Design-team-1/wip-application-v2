import type { Rect, TooltipPosition } from '../types/guide_type';

// 타겟 사각형에 여백을 더한 컷아웃(구멍) 영역 계산
export function computeCutout(rect: Rect, padding: number): Rect {
  return {
    x: rect.x - padding,
    y: rect.y - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  };
}

// 말풍선을 컷아웃 위/아래 중 어디에 둘지 결정
export function resolveTooltipSide(
  cutout: Rect,
  screenHeight: number,
  preferred: TooltipPosition = 'auto',
): 'top' | 'bottom' {
  if (preferred === 'top') return 'top';
  if (preferred === 'bottom') return 'bottom';
  const centerY = cutout.y + cutout.height / 2;
  // 타겟이 화면 하단에 있으면 말풍선은 위로
  return centerY > screenHeight / 2 ? 'top' : 'bottom';
}
