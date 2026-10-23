import type { SkeletonBoxStyleOptions } from '../../types/pill_detail_component_type';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E0E0E0',
  },
});

export const getSkeletonBoxStyle = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  opacity,
}: SkeletonBoxStyleOptions) => [
  styles.skeleton,
  { width, height, borderRadius, opacity },
];
