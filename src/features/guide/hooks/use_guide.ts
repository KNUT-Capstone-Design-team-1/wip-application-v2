import { useCallback, useSyncExternalStore } from 'react';
import {
  startTour,
  stopTour,
  nextStep,
  prevStep,
  goToStep,
  subscribe,
  getSnapshot,
} from '../store/guide_tour_store';
import { shouldAutoShow, markSeen } from '../utils/guide_visibility';
import { useGuideContext } from './use_guide_context';
import type { GuideTour } from '../types/guide_type';

/**
 * 투어 제어 훅.
 *
 * **반드시 `<GuideProvider>` 안에서 호출**. 미사용 상황에서 쓰면 context 에러.
 * `createFeatureGuide().wrap()` 로 감싼 스크린이라면 자식 어디서든 안전하다.
 *
 * @returns
 * - `start(tour)`: **노출 조건 무시** 하고 즉시 시작 (수동/'다시보기' 용)
 * - `autoStart(tour)`: `visibility` 에 따라 조건부로 시작. `'once'` 면 저장소에 "봤음" 기록 후 1회
 * - `stop()`: 현재 투어 종료
 * - `next()` / `prev()` / `goTo(index)`: 스텝 이동
 */
export function useGuide() {
  const ctx = useGuideContext();

  // Provider 의 기본값(tooltipMode / animation) 을 투어가 지정하지 않은 필드에 주입.
  // 투어가 명시한 값이 있으면 Provider 기본값보다 우선.
  const resolve = useCallback(
    (tour: GuideTour): GuideTour => ({
      tooltipMode: ctx.defaults.tooltipMode,
      animation: ctx.defaults.animation,
      ...tour,
    }),
    [ctx.defaults],
  );

  const start = useCallback(
    (tour: GuideTour) => {
      const resolved = resolve(tour);
      if (resolved.steps.length === 0) return;
      startTour(resolved);
    },
    [resolve],
  );

  const autoStart = useCallback(
    async (tour: GuideTour) => {
      const resolved = resolve(tour);
      if (resolved.steps.length === 0) return;
      const visibility = resolved.visibility ?? 'once';
      const version = resolved.version ?? 1;
      const ok = await shouldAutoShow(
        ctx.storage,
        resolved.id,
        visibility,
        version,
      );
      if (!ok) return;
      // 'once' 는 노출 전에 먼저 기록 — 중복 발화(재진입 등) 시 두 번 뜨지 않도록.
      // 'always' 는 기록 안 함(계속 재노출), 'never' 는 이미 shouldAutoShow 에서 걸러짐.
      if (visibility === 'once') {
        await markSeen(ctx.storage, resolved.id, version);
      }
      startTour(resolved);
    },
    [ctx.storage, resolve],
  );

  return {
    start,
    autoStart,
    stop: stopTour,
    next: nextStep,
    prev: prevStep,
    goTo: goToStep,
  };
}

/**
 * 현재 투어 상태 구독(주로 `GuideOverlay` 내부용).
 * `useSyncExternalStore` 로 활성 투어 + 스텝 인덱스가 바뀔 때만 리렌더.
 */
export function useGuideState() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
