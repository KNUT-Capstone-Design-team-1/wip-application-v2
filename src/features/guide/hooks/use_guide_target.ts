import { useCallback, useEffect, useRef } from 'react';
import type { View } from 'react-native';
import {
  registerTarget,
  unregisterTarget,
  notifyTargetLayoutChange,
} from '../store/guide_target_registry';

/**
 * 투어에서 강조할 요소에 붙일 ref + onLayout 핸들러를 돌려주는 훅.
 *
 * - `ref` 를 측정 가능한 네이티브 View 에 (`<View ref={ref} collapsable={false}>`),
 *   `onLayout` 을 같은 View 의 prop 에 꽂으면 등록과 레이아웃 추적이 함께 걸린다.
 * - 통상적으론 **`<GuideTarget id>` 래퍼** 쓰는 쪽이 편함. 커스텀 측정이 필요할 때만 직접 사용.
 * - 등록은 commit 이후 `useEffect` 에서 — "렌더 top-down → effect bottom-up" 흐름을 이용해
 *   부모의 `autoStart` 가 돌 시점엔 이미 레지스트리가 채워져 있음.
 */
export function useGuideTarget(id: string) {
  const ref = useRef<View | null>(null);

  useEffect(() => {
    registerTarget(id, ref);
    return () => unregisterTarget(id, ref);
  }, [id]);

  const onLayout = useCallback(() => {
    notifyTargetLayoutChange(id);
  }, [id]);

  return { ref, onLayout };
}
