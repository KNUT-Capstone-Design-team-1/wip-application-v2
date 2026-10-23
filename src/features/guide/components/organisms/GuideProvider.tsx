import React, { useMemo } from 'react';
import type {
  StorageAdapter,
  GuideTheme,
  GuideLabels,
  TooltipMode,
  EnterAnimation,
  GuideChildren,
} from '@features/guide/types/guide_type';
import {
  resolveTheme,
  resolveLabels,
} from '@features/guide/constants/guide_defaults';
import {
  GuideContext,
  GuideContextValue,
} from '@features/guide/hooks/use_guide_context';

export interface GuideProviderProps {
  children: GuideChildren;
  // 'once' 노출 기록 저장소 (미지정 시 메모리 — 앱 재시작 시 초기화)
  storage?: StorageAdapter;
  theme?: GuideTheme;
  labels?: GuideLabels;
  // 투어에서 개별 지정 안 하면 사용할 기본 말풍선 모드
  tooltipMode?: TooltipMode;
  animation?: EnterAnimation;
}

// storage 미주입 시 기본 인메모리 저장소
function createMemoryStorage(): StorageAdapter {
  const memory = new Map<string, string>();
  return {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => {
      memory.set(key, value);
    },
  };
}

/**
 * 가이드 설정(테마/라벨/저장소/기본값)을 주입하는 Provider.
 * 화면 루트에 두고 내부에 <GuideOverlay /> 를 1회 렌더하세요.
 */
export const GuideProvider: React.FC<GuideProviderProps> = ({
  children,
  storage,
  theme,
  labels,
  tooltipMode = 'button',
  animation = 'fade',
}) => {
  const value = useMemo<GuideContextValue>(() => {
    return {
      storage: storage ?? createMemoryStorage(),
      theme: resolveTheme(theme),
      labels: resolveLabels(labels),
      defaults: { tooltipMode, animation },
    };
    // theme/labels 는 객체 리터럴로 들어올 수 있어 JSON 기준으로 메모
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    storage,
    JSON.stringify(theme),
    JSON.stringify(labels),
    tooltipMode,
    animation,
  ]);

  return (
    <GuideContext.Provider value={value}>{children}</GuideContext.Provider>
  );
};
