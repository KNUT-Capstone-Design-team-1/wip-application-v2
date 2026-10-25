import type { MutableRefObject } from 'react';
import type { View } from 'react-native';

/**
 * `<GuideTarget id>` 들이 자신의 View ref 를 등록하는 **모듈 레벨 Map**.
 *
 * - ref 는 직렬화 불가능하므로 zustand/context 가 아니라 모듈 스코프 Map 으로 관리
 * - 같은 id 가 서로 다른 화면에서 중복 등록되면 **마지막 등록이 이김** (덮어쓰기)
 * - 언마운트 시 자기 ref 와 동일할 때만 지워, 뒤에 들어온 등록을 실수로 날리지 않음
 */
const targets = new Map<string, MutableRefObject<View | null>>();

/** 타겟 등록 — 보통 `<GuideTarget>` 또는 `useGuideTarget` 이 호출 */
export function registerTarget(id: string, ref: MutableRefObject<View | null>) {
  targets.set(id, ref);
}

/**
 * 타겟 해제. 자기가 등록한 ref 와 동일할 때만 삭제.
 * (다른 화면이 같은 id 로 이미 재등록했다면 그 등록을 보존)
 */
export function unregisterTarget(
  id: string,
  ref: MutableRefObject<View | null>,
) {
  if (targets.get(id) === ref) {
    targets.delete(id);
  }
}

/** 측정 시점에 오버레이가 조회. 등록이 아직 없으면 `null` */
export function getTargetRef(id: string): MutableRefObject<View | null> | null {
  return targets.get(id) ?? null;
}
