import type { GuideTheme, GuideLabels } from '../types/guide_type';

/**
 * `GuideProvider` 에 테마 미주입 시 적용되는 기본값.
 *
 * 색은 Tailwind slate/cyan 톤의 중립 팔레트. `@constants/color` 를 참조하지 않는 이유는
 * 모듈 독립성(라이브러리로 뜯어낼 가능성) 때문 — 앱 톤에 맞추려면 Provider 에 `theme` 주입.
 */
export const DEFAULT_THEME = {
  overlayColor: '#000',
  overlayOpacity: 0.72,
  spotlight: {
    borderRadius: 12,
    padding: 8,
  },
  tooltip: {
    backgroundColor: '#FFFFFF',
    titleColor: '#0F172A',
    descriptionColor: '#334155',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 16,
  },
  button: {
    primaryColor: '#2CB7DE',
    textColor: '#FFFFFF',
    skipColor: '#94A3B8',
  },
  arrow: {
    size: 8,
    color: '#FFFFFF',
  },
  dotColor: '#CBD5E1',
  dotActiveColor: '#2CB7DE',
};

/** 라벨 미주입 시 적용되는 한국어 기본값 */
export const DEFAULT_LABELS: Required<GuideLabels> = {
  next: '다음',
  prev: '이전',
  skip: '건너뛰기',
  done: '완료',
};

/**
 * 사용자 테마와 `DEFAULT_THEME` 을 **얕은 머지(단, 중첩 객체는 각각 머지)** 로 합친다.
 * 사용자가 넘긴 필드만 덮어쓰므로 부분 커스터마이즈가 안전.
 */
export function resolveTheme(theme?: GuideTheme) {
  return {
    overlayColor: theme?.overlayColor ?? DEFAULT_THEME.overlayColor,
    overlayOpacity: theme?.overlayOpacity ?? DEFAULT_THEME.overlayOpacity,
    spotlight: { ...DEFAULT_THEME.spotlight, ...theme?.spotlight },
    tooltip: { ...DEFAULT_THEME.tooltip, ...theme?.tooltip },
    button: { ...DEFAULT_THEME.button, ...theme?.button },
    arrow: { ...DEFAULT_THEME.arrow, ...theme?.arrow },
    dotColor: theme?.dotColor ?? DEFAULT_THEME.dotColor,
    dotActiveColor: theme?.dotActiveColor ?? DEFAULT_THEME.dotActiveColor,
  };
}

/**
 * `resolveTheme` 반환 타입.
 * `GuideTheme` 과 달리 모든 필드가 **필수(기본값 보장)** 이므로, 내부 코드는 옵셔널 체이닝 없이 접근 가능.
 */
export type ResolvedTheme = ReturnType<typeof resolveTheme>;

/** 사용자 라벨 ∪ `DEFAULT_LABELS` 머지 */
export function resolveLabels(labels?: GuideLabels): Required<GuideLabels> {
  return { ...DEFAULT_LABELS, ...labels };
}
