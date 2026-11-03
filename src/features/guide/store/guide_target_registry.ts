import type { MutableRefObject } from 'react';
import type { View } from 'react-native';

/**
 * `<GuideTarget id>` 들이 자신의 View ref 를 등록하는 **모듈 레벨 Map**.
 *
 * - ref 는 직렬화 불가능하므로 zustand/context 가 아니라 모듈 스코프 Map 으로 관리
 * - 같은 id 가 서로 다른 화면에서 중복 등록되면 **마지막 등록이 이김** (덮어쓰기)
 * - 언마운트 시 자기 ref 와 동일할 때만 지워, 뒤에 들어온 등록을 실수로 날리지 않음
 *
 * 레이아웃 변경 알림(`notify/subscribeTargetLayoutChange`):
 * 타겟 View 의 `onLayout` 이 호출되면 활성 투어에게 알려 자동 재측정하게 하기 위한 pub/sub.
 * 콘텐츠 로딩, 키보드, 폰트/이미지 지연 로드, 애니메이션 종료 등으로 타겟이 리사이즈되면
 * `GuideTarget` 이 이 알림을 쏘고 `useGuideMeasure` 가 받아 홀을 다시 그린다.
 */
const targets = new Map<string, MutableRefObject<View | null>>();
const layoutListeners = new Map<string, Set<() => void>>();

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

/**
 * 타겟 레이아웃이 바뀌었음을 알린다. `<GuideTarget>` 의 `onLayout` 에서 호출.
 * 이 id 를 구독 중인 리스너(= 활성 투어의 측정 훅)에게만 전달 — 다른 id 는 영향 없음.
 */
export function notifyTargetLayoutChange(id: string) {
  const set = layoutListeners.get(id);
  if (set) set.forEach((l) => l());
}

/**
 * 특정 타겟의 레이아웃 변경 구독. 활성 스텝의 타겟에 대해 측정 훅이 호출한다.
 * 구독자가 0명이 되면 Map 에서 정리하여 레지스트리가 무한히 커지지 않도록 한다.
 */
export function subscribeTargetLayoutChange(
  id: string,
  listener: () => void,
): () => void {
  let set = layoutListeners.get(id);
  if (!set) {
    set = new Set();
    layoutListeners.set(id, set);
  }
  set.add(listener);
  return () => {
    const current = layoutListeners.get(id);
    if (!current) return;
    current.delete(listener);
    if (current.size === 0) layoutListeners.delete(id);
  };
}
