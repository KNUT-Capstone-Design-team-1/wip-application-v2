import type { GuideTheme, GuideLabels } from '../types/guide_type';

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
  dotColor: '#CBD5E1',
  dotActiveColor: '#2CB7DE',
};

export const DEFAULT_LABELS: Required<GuideLabels> = {
  next: '다음',
  prev: '이전',
  skip: '건너뛰기',
  done: '완료',
};

export function resolveTheme(theme?: GuideTheme) {
  return {
    overlayColor: theme?.overlayColor ?? DEFAULT_THEME.overlayColor,
    overlayOpacity: theme?.overlayOpacity ?? DEFAULT_THEME.overlayOpacity,
    spotlight: { ...DEFAULT_THEME.spotlight, ...theme?.spotlight },
    tooltip: { ...DEFAULT_THEME.tooltip, ...theme?.tooltip },
    button: { ...DEFAULT_THEME.button, ...theme?.button },
    dotColor: theme?.dotColor ?? DEFAULT_THEME.dotColor,
    dotActiveColor: theme?.dotActiveColor ?? DEFAULT_THEME.dotActiveColor,
  };
}

export type ResolvedTheme = ReturnType<typeof resolveTheme>;

export function resolveLabels(labels?: GuideLabels): Required<GuideLabels> {
  return { ...DEFAULT_LABELS, ...labels };
}
