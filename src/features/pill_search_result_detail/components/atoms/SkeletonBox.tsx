import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import {
  SKELETON_FADE_DURATION_MS,
  SKELETON_MIN_OPACITY,
} from '../../constants/pill_detail';
import { styles } from '../../styles/components/atoms/SkeletonBox';
import type { SkeletonBoxProps } from '../../types/pill_detail_component_type';

// 스켈레톤 점멸 애니메이션·해제 관리.
const useSkeletonAnimation = () => {
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

const SkeletonBox = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}: SkeletonBoxProps) => {
  const opacity = useSkeletonAnimation();

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export default SkeletonBox;
