import { useEffect, useRef } from 'react';
import type { View } from 'react-native';
import {
  registerTarget,
  unregisterTarget,
} from '../store/guide_target_registry';

/**
 * 투어에서 강조할 요소에 붙일 ref 를 반환하는 훅.
 * 보통은 <GuideTarget id> 래퍼가 더 편리합니다.
 */
export function useGuideTarget(id: string) {
  const ref = useRef<View | null>(null);

  useEffect(() => {
    registerTarget(id, ref);
    return () => unregisterTarget(id, ref);
  }, [id]);

  return ref;
}
