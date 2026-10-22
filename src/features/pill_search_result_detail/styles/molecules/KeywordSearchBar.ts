import { StyleSheet } from 'react-native';
import { COLOR } from '@constants/color';
import { screenPadding } from '@constants/size';
import { px } from '@utils/responsive';

const buttonSize = px(44, 44, 48);

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: screenPadding.horizontal,
    zIndex: 10,
    gap: px(12),
    alignItems: 'center',
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    backgroundColor: COLOR.primary,
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.35,
  },
});

export const getKeywordSearchBarStyle = (bottomInset: number) => [
  styles.container,
  { bottom: bottomInset + px(16) },
];
