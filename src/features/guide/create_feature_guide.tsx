import React, { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { GuideProvider } from './components/organisms/GuideProvider';
import { GuideOverlay } from './components/organisms/GuideOverlay';
import { useGuide } from './hooks/use_guide';
import type { GuideTour, StorageAdapter } from './types/guide_type';

/**
 * `createFeatureGuide` 에 주입하는 옵션.
 */
export interface FeatureGuideOptions {
  /**
   * "최초 1회" 노출 기록을 보관할 저장소 어댑터.
   *
   * - 미지정 시 **인메모리** 저장소가 쓰이고, 앱 재시작하면 "본 적 없음" 상태로 돌아감
   *   (= `visibility: 'once'` 가 자동 재노출됨). 보통 개발/테스트 외엔 쓰지 않음.
   * - 실제 운영은 `@utils/guide_storage` 의 `guideStorage` (AsyncStorage 어댑터) 주입.
   */
  storage?: StorageAdapter;
}

/**
 * `createFeatureGuide` 가 돌려주는 "feature 가이드 박스".
 *
 * @typeParam P - `wrap` 이 감쌀 스크린 컴포넌트의 props 타입. 보통 추론으로 충분
 */
export interface FeatureGuide<P extends object> {
  /** 스크린을 Provider + Overlay + autoStart 로 감싼 새 컴포넌트를 반환 */
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
 * 기능별 가이드 투어를 스크린 쉘(Provider + Overlay + 자동 시작)로 묶어주는 팩토리.
 *
 * **동작 모델:**
 * 호출 시점에 `tour` / `options` 를 클로저로 가둔 함수 3개(`wrap` / `useReplay` / `tour`) 를
 * 돌려준다. 실제 렌더링은 `wrap(Screen)` 의 결과물이 라우터에 의해 마운트될 때 일어난다.
 *
 * **사용 예:**
 * ```ts
 * // features/xxx/guide.ts
 * export const xxxGuide = createFeatureGuide(XXX_TOUR, { storage: guideStorage });
 *
 * // features/xxx/screens/XxxScreen.tsx
 * const Content = () => {
 *   const replay = xxxGuide.useReplay();
 *   return <Pressable onPress={replay}><CircleQuestionMark/></Pressable>;
 * };
 * export default xxxGuide.wrap(Content);
 * ```
 */
export function createFeatureGuide<P extends object = {}>(
  tour: GuideTour,
  options: FeatureGuideOptions = {},
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

  // `Inner` 를 Provider / Overlay / AutoStart 로 감싼 새 FC 를 만들어 반환.
  // 반환된 컴포넌트가 라우터의 export default 가 되어 실제 렌더 트리에 들어간다.
  const wrap: FeatureGuide<P>['wrap'] = (Inner) => {
    const Wrapped: React.FC<P> = (props) => (
      <GuideProvider storage={options.storage}>
        <AutoStart>
          <Inner {...props} />
        </AutoStart>
        <GuideOverlay />
      </GuideProvider>
    );
    Wrapped.displayName = `withGuide(${
      Inner.displayName ?? Inner.name ?? 'Component'
    })`;
    return Wrapped;
  };

  // 수동 재생용(? 버튼). `visibility` 를 무시하고 즉시 투어 시작.
  // Provider 바깥에서 호출하면 `useGuide` 가 던진다 — 반드시 `wrap` 안쪽에서만.
  const useReplay: FeatureGuide<P>['useReplay'] = () => {
    const { start } = useGuide();
    return useCallback(() => start(tour), [start]);
  };

  return { wrap, useReplay, tour };
}
