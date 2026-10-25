import type { GuideTour } from '../types/guide_type';

/**
 * 활성 투어와 현재 스텝 인덱스를 보관하는 모듈 레벨 미니 스토어.
 *
 * - `useSyncExternalStore` 기반이므로 외부 상태 라이브러리(zustand 등) 의존 없음
 * - 투어는 **동시에 하나만** 활성화 (앱 전역) — Provider 는 여러 개여도 상태는 공유
 * - 스냅샷은 **참조 안정성** 을 지키므로 변경이 없으면 리스너가 재실행되지 않음
 */
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

/** `useSyncExternalStore` 용 구독 등록. 반환 함수로 해제 */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * 현재 상태 스냅샷.
 *
 * 반환 참조는 **상태가 바뀔 때만** 교체된다(= `setState` 에서 새 객체 생성).
 * `useSyncExternalStore` 가 이 참조로 변경을 감지하므로, 함수 내부에서 매번 새 객체를
 * 만들면 무한 리렌더에 빠진다 — 바꾸지 말 것.
 */
export function getSnapshot(): TourState {
  return state;
}

function setState(partial: Partial<TourState>) {
  state = { ...state, ...partial };
  emit();
}

/** 새 투어를 시작 (0번 스텝부터). 이미 진행 중인 투어는 교체됨 */
export function startTour(tour: GuideTour) {
  setState({ activeTour: tour, stepIndex: 0 });
}

/** 현재 투어 종료. 활성 투어가 없으면 no-op (불필요한 emit 방지) */
export function stopTour() {
  if (!state.activeTour) return;
  setState({ activeTour: null, stepIndex: 0 });
}

/** 다음 스텝으로. 마지막 스텝이면 `stopTour` 와 동일 */
export function nextStep() {
  const { activeTour, stepIndex } = state;
  if (!activeTour) return;
  if (stepIndex + 1 >= activeTour.steps.length) {
    stopTour();
  } else {
    setState({ stepIndex: stepIndex + 1 });
  }
}

/** 이전 스텝으로. 0번에서 호출하면 0에 머무름 */
export function prevStep() {
  if (!state.activeTour) return;
  setState({ stepIndex: Math.max(0, state.stepIndex - 1) });
}

/** 특정 스텝으로 점프. 범위 밖이면 가장 가까운 유효 인덱스로 클램프 */
export function goToStep(index: number) {
  const { activeTour } = state;
  if (!activeTour) return;
  const clamped = Math.max(0, Math.min(activeTour.steps.length - 1, index));
  setState({ stepIndex: clamped });
}
