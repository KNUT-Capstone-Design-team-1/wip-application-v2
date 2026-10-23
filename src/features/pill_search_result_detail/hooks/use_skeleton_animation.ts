import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import {
  SKELETON_FADE_DURATION_MS,
  SKELETON_MIN_OPACITY,
} from '../constants/pill_detail';

// 스켈레톤 점멸 애니메이션·해제 관리.
export const useSkeletonAnimation = () => {
  const opacity = useRef(new Animated.Value(SKELETON_MIN_OPACITY)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: SKELETON_FADE_DURATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: SKELETON_MIN_OPACITY,
          duration: SKELETON_FADE_DURATION_MS,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return opacity;
};
