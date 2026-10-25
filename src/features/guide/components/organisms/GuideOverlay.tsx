import React, { useCallback } from 'react';
import {
  View,
  Pressable,
  Animated,
  Modal,
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
 * 투어 활성 시 Modal 로 윈도우 전체를 덮어 dim + 타겟 하이라이트 + 말풍선을 표시한다.
 * <GuideProvider> 내부(화면 루트)에 한 번 렌더하세요.
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
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      hardwareAccelerated
      onRequestClose={stopTour}
    >
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
    </Modal>
  );
};
