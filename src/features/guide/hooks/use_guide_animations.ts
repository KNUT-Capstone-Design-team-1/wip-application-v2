import { useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';
import type { EnterAnimation, GuideTour, Rect } from '../types/guide_type';
import {
  BACKDROP_FADE_MS,
  CARD_ENTER_MS,
  CARD_ENTER_SCALE_FROM,
  CARD_ENTER_TRANSLATE_FROM,
} from '../constants/guide_animation_constant';

/**
 * 투어 상태 변화에 맞춘 애니메이션 값들.
 * - backdrop:  투어 활성 여부에 따른 fade in/out
 * - cardStyle: 스텝 전환 시 말풍선 등장 애니메이션 (fade/scale/none)
 */
export function useGuideAnimations(
  activeTour: GuideTour | null,
  rect: Rect | null,
  stepIndex: number,
  animation: EnterAnimation,
) {
  const backdrop = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(backdrop, {
      toValue: activeTour ? 1 : 0,
      duration: BACKDROP_FADE_MS,
      useNativeDriver: true,
    }).start();
  }, [activeTour, backdrop]);

  useEffect(() => {
    if (!rect) return;
    if (animation === 'none') {
      cardAnim.setValue(1);
      return;
    }
    cardAnim.setValue(0);
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: CARD_ENTER_MS,
      useNativeDriver: true,
    }).start();
  }, [rect, stepIndex, animation, cardAnim]);

  const cardStyle = useMemo(() => {
    const opacity = animation === 'none' ? 1 : cardAnim;
    const transform =
      animation === 'scale'
        ? [
            {
              scale: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [CARD_ENTER_SCALE_FROM, 1],
              }),
            },
          ]
        : animation === 'fade'
          ? [
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [CARD_ENTER_TRANSLATE_FROM, 0],
                }),
              },
            ]
          : [];
    return { opacity, transform };
  }, [animation, cardAnim]);

  return { backdrop, cardStyle };
}
