import type { MutableRefObject } from 'react';
import type { View } from 'react-native';

// 타겟 ref 는 직렬화 대상이 아니므로 모듈 레벨 Map 으로 관리
const targets = new Map<string, MutableRefObject<View | null>>();

export function registerTarget(id: string, ref: MutableRefObject<View | null>) {
  targets.set(id, ref);
}

export function unregisterTarget(
  id: string,
  ref: MutableRefObject<View | null>,
) {
  // 같은 id 를 다른 화면이 이미 다시 등록했다면 덮어쓰지 않도록 보호
  if (targets.get(id) === ref) {
    targets.delete(id);
  }
}

export function getTargetRef(id: string): MutableRefObject<View | null> | null {
  return targets.get(id) ?? null;
}
