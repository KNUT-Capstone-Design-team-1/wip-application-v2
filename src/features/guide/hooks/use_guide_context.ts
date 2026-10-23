import { createContext, useContext } from 'react';
import type {
  StorageAdapter,
  GuideLabels,
  TooltipMode,
  EnterAnimation,
} from '../types/guide_type';
import type { ResolvedTheme } from '../constants/guide_defaults';

export interface GuideContextValue {
  storage: StorageAdapter;
  theme: ResolvedTheme;
  labels: Required<GuideLabels>;
  defaults: {
    tooltipMode: TooltipMode;
    animation: EnterAnimation;
  };
}

export const GuideContext = createContext<GuideContextValue | null>(null);

export function useGuideContext(): GuideContextValue {
  const ctx = useContext(GuideContext);
  if (!ctx) {
    throw new Error('가이드 컴포넌트를 <GuideProvider> 로 감싸주세요.');
  }
  return ctx;
}
