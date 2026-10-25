import { StyleSheet } from 'react-native';
import { screenPadding } from '@constants/size';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: screenPadding.horizontal,
    zIndex: 10,
    gap: px(12),
    width: px(44),
    alignItems: 'stretch',
  },
});

export const getKeywordSearchBarStyle = (bottomInset: number) => [
  styles.container,
  { bottom: bottomInset + px(16) },
];
