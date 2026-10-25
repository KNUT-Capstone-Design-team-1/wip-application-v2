/**
 * 가이드 투어(스포트라이트 코치마크) 모듈 공개 API.
 *
 * **사용 흐름 요약:**
 * 1. feature별 `guide.ts` 에서 `createFeatureGuide(TOUR, { storage })` 로 "가이드 박스" 생성
 * 2. 스크린을 `xxxGuide.wrap(Screen)` 로 감싸 export (= Provider + Overlay + 자동 시작 포함)
 * 3. 강조할 요소를 `<GuideTarget id="...">` 로 감싸고, step.id 와 매칭
 * 4. ScrollView 영역에는 `useGuideScroll()` 을 꽂아 off-screen 타겟 자동 스크롤
 * 5. ? 버튼은 `xxxGuide.useReplay()` 로 수동 재생 연결
 *
 * 자세한 설계와 날짜별 변경 이력은 `docs/GUIDE_TOUR.md` 참고.
 */

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
