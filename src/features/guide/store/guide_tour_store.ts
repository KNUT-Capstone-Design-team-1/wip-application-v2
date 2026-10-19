import type { GuideTour } from '../types/guide_type';

// useSyncExternalStore 기반 미니 스토어 (활성 투어 + 현재 스텝 인덱스)
export interface TourState {
  activeTour: GuideTour | null;
  stepIndex: number;
}

type Listener = () => void;

let state: TourState = { activeTour: null, stepIndex: 0 };
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// 스냅샷은 동일 참조를 유지(변경 시에만 새 객체) → useSyncExternalStore 무한 루프 방지
export function getSnapshot(): TourState {
  return state;
}

function setState(partial: Partial<TourState>) {
  state = { ...state, ...partial };
  emit();
}

export function startTour(tour: GuideTour) {
  setState({ activeTour: tour, stepIndex: 0 });
}

export function stopTour() {
  if (!state.activeTour) return;
  setState({ activeTour: null, stepIndex: 0 });
}

export function nextStep() {
  const { activeTour, stepIndex } = state;
  if (!activeTour) return;
  if (stepIndex + 1 >= activeTour.steps.length) {
    stopTour();
  } else {
    setState({ stepIndex: stepIndex + 1 });
  }
}

export function prevStep() {
  if (!state.activeTour) return;
  setState({ stepIndex: Math.max(0, state.stepIndex - 1) });
}

export function goToStep(index: number) {
  const { activeTour } = state;
  if (!activeTour) return;
  const clamped = Math.max(0, Math.min(activeTour.steps.length - 1, index));
  setState({ stepIndex: clamped });
}
