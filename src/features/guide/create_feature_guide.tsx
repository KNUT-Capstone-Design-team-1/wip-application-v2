import React, { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { useGuide } from './hooks/use_guide';
import type { GuideTour } from './types/guide_type';

/**
 * `createFeatureGuide` 가 돌려주는 "feature 가이드 박스".
 *
 * @typeParam P - `wrap` 이 감쌀 스크린 컴포넌트의 props 타입. 보통 추론으로 충분
 */
export interface FeatureGuide<P extends object> {
  /** 스크린을 포커스 시 투어 자동 시작 로직으로 감싼 새 컴포넌트 반환 */
  wrap: (Inner: React.ComponentType<P>) => React.FC<P>;
  /**
   * `wrap` 내부(= 가이드 Provider 안쪽) 에서 쓰는 훅.
   * 반환된 함수를 호출하면 `visibility` 무시하고 투어를 **강제로 재생**한다 (? 버튼용).
   */
  useReplay: () => () => void;
  /** 디버깅/테스트용으로 원본 투어 객체 그대로 노출 */
  tour: GuideTour;
}

/**
 * 기능별 가이드 투어를 "스크린 포커스 시 autoStart" 로직으로 묶어주는 팩토리.
 *
 * **아키텍처 주의 (중요):**
 * `GuideProvider` 와 `GuideOverlay` 는 **앱 루트** (`app/_layout.tsx`) 에 한 번만 둔다.
 * feature별로 Provider/Overlay 를 두면 overlay 와 타겟이 서로 다른 React root / native window
 * 가 되어 `measureInWindow` 좌표가 어긋난다 (edge-to-edge + translucent 상태바에서 홀이 밀리는 버그).
 *
 * **사용 예:**
 * ```ts
 * // features/xxx/guide.ts
 * export const xxxGuide = createFeatureGuide(XXX_TOUR);
 *
 * // features/xxx/screens/XxxScreen.tsx
 * const Screen = () => {
 *   const replay = xxxGuide.useReplay();
 *   return <Pressable onPress={replay}><CircleQuestionMark/></Pressable>;
 * };
 * export default xxxGuide.wrap(Screen);
 * ```
 */
export function createFeatureGuide<P extends object = {}>(
  tour: GuideTour,
): FeatureGuide<P> {
  // 포커스 시 자동 노출 — `visibility` 가 'once' 면 저장소에 "봤음" 기록 후 1회 뜸.
  // 자식 effect 가 먼저 돌아 타겟 레지스트리가 채워진 뒤 호출되므로 ref 가 비는 일이 없다.
  const AutoStart: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { autoStart } = useGuide();
    useFocusEffect(
      useCallback(() => {
        autoStart(tour);
      }, [autoStart]),
    );
    return <>{children}</>;
  };

  const wrap: FeatureGuide<P>['wrap'] = (Inner) => {
    const Wrapped: React.FC<P> = (props) => (
      <AutoStart>
        <Inner {...props} />
      </AutoStart>
    );
    Wrapped.displayName = `withGuide(${
      Inner.displayName ?? Inner.name ?? 'Component'
    })`;
    return Wrapped;
  };

  // 수동 재생용(? 버튼). `visibility` 를 무시하고 즉시 투어 시작.
  // Provider 바깥에서 호출하면 `useGuide` 가 던진다 — 앱 루트 Provider 안에서만.
  const useReplay: FeatureGuide<P>['useReplay'] = () => {
    const { start } = useGuide();
    return useCallback(() => start(tour), [start]);
  };

  return { wrap, useReplay, tour };
}
