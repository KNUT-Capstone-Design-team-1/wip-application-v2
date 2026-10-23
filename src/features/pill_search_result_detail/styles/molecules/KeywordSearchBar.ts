import { StyleSheet } from 'react-native';
import { screenPadding } from '@constants/size';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: screenPadding.horizontal,
    zIndex: 10,
    gap: px(12),
    alignItems: 'center',
  },
});

export const getKeywordSearchBarStyle = (bottomInset: number) => [
  styles.container,
  { bottom: bottomInset + px(16) },
];
