import React, { useCallback, useEffect } from 'react';
import {
  View,
  Pressable,
  Animated,
  BackHandler,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Svg, { Defs, Mask, Rect as SvgRect, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGuideState } from '@features/guide/hooks/use_guide';
import { useGuideContext } from '@features/guide/hooks/use_guide_context';
import { useGuideMeasure } from '@features/guide/hooks/use_guide_measure';
import { useGuideAnimations } from '@features/guide/hooks/use_guide_animations';
import {
  nextStep,
  prevStep,
  stopTour,
  goToStep,
} from '@features/guide/store/guide_tour_store';
import { computeTooltipLayout } from '@features/guide/utils/guide_tooltip_layout';
import { GuideTooltip } from '@features/guide/components/molecules/GuideTooltip';
import { GuideSlides } from '@features/guide/components/molecules/GuideSlides';
import { styles } from '@features/guide/styles/organisms/GuideOverlay';

/**
 * 투어 활성 시 화면 전체를 덮어 dim + 타겟 하이라이트 + 말풍선을 표시.
 *
 * **반드시 앱 루트(`app/_layout.tsx`) 에 한 번만** 마운트. feature별로 각각 두지 않는다.
 *
 * Modal 을 쓰지 않는 이유 (중요):
 * Android 에서 `Modal` 은 **별도 native window** 를 만든다. 안쪽 View 와 바깥의 타겟 View 는
 * `measureInWindow` 가 서로 다른 window 를 기준으로 좌표를 돌려주므로, edge-to-edge /
 * statusBarTranslucent 조합에서 홀 위치가 상태바·헤더 높이만큼 어긋나는 문제가 생겼다.
 * 앱 루트에 올려 **같은 window / 같은 React root** 에서 측정 → 좌표가 자연 정렬된다.
 * edge-to-edge 가 켜져 있어 메인 앱 창이 이미 상태바까지 덮으므로 Modal 없이도 전체 화면 dim 가능.
 */
export const GuideOverlay: React.FC = () => {
  const { activeTour, stepIndex } = useGuideState();
  const { theme, labels } = useGuideContext();
  const { width: W, height: H } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const step = activeTour ? activeTour.steps[stepIndex] : null;
  const total = activeTour ? activeTour.steps.length : 0;
  const mode = activeTour?.tooltipMode ?? 'button';
  const animation = activeTour?.animation ?? 'fade';

  const { overlayRef, rect, cardHeight, onCardLayout } = useGuideMeasure(
    step,
    stepIndex,
    W,
    H,
    insets,
  );
  const { backdrop, cardStyle } = useGuideAnimations(
    activeTour,
    rect,
    stepIndex,
    animation,
  );

  const handleBackdropPress = useCallback(() => {
    if (mode === 'button') nextStep();
  }, [mode]);

  // Modal 제거로 Android 하드웨어 백 핸들링을 직접 처리. 투어 활성 동안만 가로채고 종료 시 해제.
  useEffect(() => {
    if (!activeTour || Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      stopTour();
      return true;
    });
    return () => sub.remove();
  }, [activeTour]);

  if (!activeTour || !step) return null;

  const layout = computeTooltipLayout({
    rect,
    cardHeight,
    step,
    windowWidth: W,
    windowHeight: H,
    insetTop: insets.top,
    insetBottom: insets.bottom,
    defaultPadding: theme.spotlight.padding,
  });

  return (
    <View ref={overlayRef} style={styles.overlay} pointerEvents="box-none">
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: backdrop }]}
        pointerEvents="none"
      >
        <Svg width={W} height={H}>
          <Defs>
            <Mask id="guide-hole">
              <SvgRect x={0} y={0} width={W} height={H} fill="#fff" />
              {rect &&
                (layout.isCircle ? (
                  <Circle
                    cx={layout.circleCenter.x}
                    cy={layout.circleCenter.y}
                    r={layout.circleRadius}
                    fill="#000"
                  />
                ) : (
                  <SvgRect
                    x={layout.cutout.x}
                    y={layout.cutout.y}
                    width={layout.cutout.width}
                    height={layout.cutout.height}
                    rx={theme.spotlight.borderRadius}
                    ry={theme.spotlight.borderRadius}
                    fill="#000"
                  />
                ))}
            </Mask>
          </Defs>
          <SvgRect
            x={0}
            y={0}
            width={W}
            height={H}
            fill={theme.overlayColor}
            fillOpacity={theme.overlayOpacity}
            mask="url(#guide-hole)"
          />
        </Svg>
      </Animated.View>

      {/* 배경 터치: 버튼형은 다음으로 진행, 슬라이드형은 무시 */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={handleBackdropPress}
      />

      {rect && (
        <Animated.View
          onLayout={onCardLayout}
          style={[
            styles.card,
            {
              top: layout.top,
              backgroundColor: theme.tooltip.backgroundColor,
              borderColor: theme.tooltip.borderColor,
              borderWidth: theme.tooltip.borderWidth,
              borderRadius: theme.tooltip.borderRadius,
            },
            cardStyle,
          ]}
        >
          {theme.arrow.size > 0 && (
            <View
              pointerEvents="none"
              style={[
                styles.arrow,
                layout.side === 'bottom'
                  ? {
                      top: -theme.arrow.size + 1,
                      left: layout.arrowCenterX - theme.arrow.size,
                      borderLeftWidth: theme.arrow.size,
                      borderRightWidth: theme.arrow.size,
                      borderBottomWidth: theme.arrow.size,
                      borderBottomColor:
                        theme.arrow.color ?? theme.tooltip.backgroundColor,
                    }
                  : {
                      bottom: -theme.arrow.size + 1,
                      left: layout.arrowCenterX - theme.arrow.size,
                      borderLeftWidth: theme.arrow.size,
                      borderRightWidth: theme.arrow.size,
                      borderTopWidth: theme.arrow.size,
                      borderTopColor:
                        theme.arrow.color ?? theme.tooltip.backgroundColor,
                    },
              ]}
            />
          )}
          {mode === 'slide' ? (
            <GuideSlides
              steps={activeTour.steps}
              index={stepIndex}
              width={layout.slideWidth}
              theme={theme}
              labels={labels}
              onIndexChange={goToStep}
              onSkip={stopTour}
              onDone={stopTour}
            />
          ) : (
            <GuideTooltip
              step={step}
              index={stepIndex}
              total={total}
              theme={theme}
              labels={labels}
              onPrev={prevStep}
              onNext={nextStep}
              onSkip={stopTour}
            />
          )}
        </Animated.View>
      )}
    </View>
  );
};
