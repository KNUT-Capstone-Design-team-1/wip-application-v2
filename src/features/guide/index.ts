// 컴포넌트
export { GuideProvider } from './components/organisms/GuideProvider';
export type { GuideProviderProps } from './components/organisms/GuideProvider';
export { GuideOverlay } from './components/organisms/GuideOverlay';
export { GuideTarget } from './components/atoms/GuideTarget';
export type { GuideTargetProps } from './components/atoms/GuideTarget';

// 훅
export { useGuide } from './hooks/use_guide';
export { useGuideScroll } from './hooks/use_guide_scroll';

// 팩토리 (feature별 가이드 쉘)
export { createFeatureGuide } from './create_feature_guide';
export type { FeatureGuide, FeatureGuideOptions } from './create_feature_guide';

// 타입
export type {
  GuideStep,
  GuideTour,
  GuideTheme,
  GuideLabels,
  StorageAdapter,
  Shape,
  TooltipPosition,
  TooltipMode,
  Visibility,
  EnterAnimation,
  Rect,
} from './types/guide_type';
