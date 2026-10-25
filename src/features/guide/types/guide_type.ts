import type { ReactNode } from 'react';

export type Shape = 'rectangle' | 'circle';

export type TooltipPosition = 'auto' | 'top' | 'bottom';

export type TooltipMode = 'button' | 'slide';

// - always: 시작할 때마다 노출
// - once:   최초 1회만 자동 노출(영구 저장), 이후엔 수동 시작만
// - never:  자동 노출 안 함
export type Visibility = 'always' | 'once' | 'never';

export type EnterAnimation = 'fade' | 'scale' | 'none';

export interface GuideStep {
  id: string;
  title?: string;
  description: string;
  shape?: Shape;
  padding?: number;
  tooltipPosition?: TooltipPosition;
  order?: number;
}

export interface GuideTour {
  id: string;
  steps: GuideStep[];
  visibility?: Visibility;
  version?: number;
  tooltipMode?: TooltipMode;
  animation?: EnterAnimation;
}

// AsyncStorage / MMKV 등 주입용 어댑터
export interface StorageAdapter {
  getItem: (key: string) => Promise<string | null> | string | null;
  setItem: (key: string, value: string) => Promise<void> | void;
}

export interface GuideTheme {
  overlayColor?: string;
  overlayOpacity?: number;
  spotlight?: {
    borderRadius?: number;
    padding?: number;
  };
  tooltip?: {
    backgroundColor?: string;
    titleColor?: string;
    descriptionColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
  };
  button?: {
    primaryColor?: string;
    textColor?: string;
    skipColor?: string;
  };
  arrow?: {
    size?: number;
    color?: string;
  };
  dotColor?: string;
  dotActiveColor?: string;
}

export interface GuideLabels {
  next?: string;
  prev?: string;
  skip?: string;
  done?: string;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type GuideChildren = ReactNode;
