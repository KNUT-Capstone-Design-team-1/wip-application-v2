import { Animated } from 'react-native';
import { useSkeletonAnimation } from '../../hooks/use_skeleton_animation';
import { getSkeletonBoxStyle } from '../../styles/atoms/SkeletonBox';
import type { SkeletonBoxProps } from '../../types/pill_detail_component_type';

const SkeletonBox = ({
  width,
  height,
  borderRadius,
  style,
}: SkeletonBoxProps) => {
  const opacity = useSkeletonAnimation();

  return (
    <Animated.View
      style={[
        getSkeletonBoxStyle({ width, height, borderRadius, opacity }),
        style,
      ]}
    />
  );
};

export default SkeletonBox;
