import { createContext, useContext } from 'react';
import type {
  StorageAdapter,
  GuideLabels,
  TooltipMode,
  EnterAnimation,
} from '../types/guide_type';
import type { ResolvedTheme } from '../constants/guide_defaults';

/**
 * `GuideProvider` 가 자식에게 내려주는 설정 묶음.
 * - `theme` / `labels` 는 기본값과 머지된 **완전한** 형태 → 내부 코드가 옵셔널 체이닝 없이 접근
 * - `defaults` 는 투어 쪽에서 생략한 필드의 폴백값
 */
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

/**
 * context 소비 훅. `<GuideProvider>` 밖에서 호출 시 즉시 에러로 가드.
 * (잘못된 호출을 undefined 대신 명시적 예외로 드러내기 위함)
 */
export function useGuideContext(): GuideContextValue {
  const ctx = useContext(GuideContext);
  if (!ctx) {
    throw new Error('가이드 컴포넌트를 <GuideProvider> 로 감싸주세요.');
  }
  return ctx;
}
