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
 * - start:     즉시 시작(노출 조건 무시 — 수동/'다시보기' 용도)
 * - autoStart: visibility(always/once/never) 에 따라 조건부 시작
 */
export function useGuide() {
  const ctx = useGuideContext();

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

// 현재 투어 상태 구독 (주로 GuideOverlay 내부에서 사용)
export function useGuideState() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
