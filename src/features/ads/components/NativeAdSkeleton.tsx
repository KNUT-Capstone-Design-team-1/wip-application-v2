import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { styles } from '@features/ads/styles/components/NativeAdSkeleton';
interface NativeAdSkeletonProps {
  height?: number;
}

export const NativeAdSkeleton = ({ height = 100 }: NativeAdSkeletonProps) => {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.5, { duration: 800 }),
      ),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.skeletonContainer, { height }, animatedStyle]}
    >
      <View style={styles.imagePlaceholder} />
      <View style={styles.textContainer}>
        <View style={styles.textPlaceholder} />
        <View style={[styles.textPlaceholder, styles.textSmall]} />
      </View>
    </Animated.View>
  );
};
