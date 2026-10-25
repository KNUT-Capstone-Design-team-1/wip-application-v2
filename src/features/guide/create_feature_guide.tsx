import React, { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { GuideProvider } from './components/organisms/GuideProvider';
import { GuideOverlay } from './components/organisms/GuideOverlay';
import { useGuide } from './hooks/use_guide';
import type { GuideTour, StorageAdapter } from './types/guide_type';

export interface FeatureGuideOptions {
  storage?: StorageAdapter;
}

export interface FeatureGuide<P extends object> {
  wrap: (Inner: React.ComponentType<P>) => React.FC<P>;
  useReplay: () => () => void;
  tour: GuideTour;
}

/**
 * 기능별 가이드 투어를 스크린 쉘(Provider + Overlay + 자동 시작)로 묶어주는 팩토리.
 *
 * 사용 예:
 *   // features/xxx/guide.ts
 *   export const xxxGuide = createFeatureGuide(XXX_TOUR, { storage: guideStorage });
 *
 *   // features/xxx/screens/XxxScreen.tsx
 *   const Content = () => { ... };
 *   export default xxxGuide.wrap(Content);
 *
 *   // ? 버튼이 있는 자식 어디서든
 *   const replay = xxxGuide.useReplay();
 *   <Pressable onPress={replay}><CircleQuestionMark/></Pressable>
 */
export function createFeatureGuide<P extends object = {}>(
  tour: GuideTour,
  options: FeatureGuideOptions = {},
): FeatureGuide<P> {
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

  const useReplay: FeatureGuide<P>['useReplay'] = () => {
    const { start } = useGuide();
    return useCallback(() => start(tour), [start]);
  };

  return { wrap, useReplay, tour };
}
