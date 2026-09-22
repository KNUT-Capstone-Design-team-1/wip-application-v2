import { useState, useEffect } from 'react';
import {
  AppState,
  AppStateStatus,
  NativeEventSubscription,
} from 'react-native';

// 모듈 레벨 단일 타이머 및 구독자 관리 (중복 interval 방지 및 단일 타이머 보장)
type TimeListener = (date: Date) => void;

const listeners = new Set<TimeListener>();

let timerId: ReturnType<typeof setInterval> | null = null;

let appStateSubscription: NativeEventSubscription | null = null;

let currentDate = new Date();

// 두 시각이 동일한 '분(Minute)'인지 판별 (불필요한 리렌더링 쓰로틀링)
const isSameMinute = (prev: Date, next: Date): boolean => {
  return (
    prev.getFullYear() === next.getFullYear() &&
    prev.getMonth() === next.getMonth() &&
    prev.getDate() === next.getDate() &&
    prev.getHours() === next.getHours() &&
    prev.getMinutes() === next.getMinutes()
  );
};

const notifyListeners = (date: Date, force = false) => {
  // 분 단위가 바뀌지 않았고 강제 갱신이 아니면 리스너 통지 스킵 (렌더링 최적화)
  if (!force && isSameMinute(currentDate, date)) {
    return;
  }

  currentDate = date;
  for (const listener of listeners) {
    listener(date);
  }
};

const startTimer = () => {
  if (timerId !== null) {
    return;
  }
  timerId = setInterval(() => {
    notifyListeners(new Date());
  }, 60000);
};

const stopTimer = () => {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
};

const handleAppStateChange = (nextAppState: AppStateStatus) => {
  if (nextAppState === 'active') {
    // foreground 복귀 시 분 단위 확인 후 즉시 최신화 및 타이머 재시작
    notifyListeners(new Date());
    startTimer();
  } else {
    // background 진입 시 불필요한 타이머 중지 (배터리 절전)
    stopTimer();
  }
};

// 1분 단위 타이머 및 앱 foreground 복귀 시 갱신되는 현재 시각을 제공하는 커스텀 훅
export const usePharmacyCurrentTime = (): Date => {
  const [time, setTime] = useState<Date>(() => currentDate);

  useEffect(() => {
    const listener: TimeListener = (newTime) => {
      setTime(newTime);
    };

    listeners.add(listener);

    // 첫 번째 구독자가 등록될 때 단 1개의 타이머 및 AppState 리스너 시작
    if (listeners.size === 1) {
      currentDate = new Date();
      startTimer();
      appStateSubscription = AppState.addEventListener(
        'change',
        handleAppStateChange,
      );
    }

    return () => {
      listeners.delete(listener);

      // 모든 구독자가 해제될 때 타이머 및 AppState 리스너 완전 정리
      if (listeners.size === 0) {
        stopTimer();
        if (appStateSubscription) {
          appStateSubscription.remove();
          appStateSubscription = null;
        }
      }
    };
  }, []);

  return time;
};
