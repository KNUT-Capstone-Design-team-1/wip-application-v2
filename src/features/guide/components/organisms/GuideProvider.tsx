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
  /**
   * `visibility: 'once'` 기록 저장소.
   * 미지정 시 인메모리 저장소(앱 재시작 시 초기화) — 보통 개발용.
   * 실 운영은 `@utils/guide_storage` 의 AsyncStorage 어댑터.
   */
  storage?: StorageAdapter;
  /** 색상/스페이싱 커스터마이즈. 미지정 필드는 `DEFAULT_THEME` 와 머지 */
  theme?: GuideTheme;
  /** 버튼/링크 라벨. 미지정 필드는 한국어 기본값과 머지 */
  labels?: GuideLabels;
  /** 투어 쪽에서 개별 지정 안 했을 때 사용할 기본 말풍선 모드. 기본 `'button'` */
  tooltipMode?: TooltipMode;
  /** 투어 쪽에서 개별 지정 안 했을 때 사용할 기본 등장 애니메이션. 기본 `'fade'` */
  animation?: EnterAnimation;
}

// storage 미주입 시의 폴백 — 세션 메모리에만 보관.
// 실 사용에선 거의 쓰이지 않지만, Provider 가 nullable storage 를 다루지 않도록
// 생성 시점에 어댑터로 정규화한다.
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
