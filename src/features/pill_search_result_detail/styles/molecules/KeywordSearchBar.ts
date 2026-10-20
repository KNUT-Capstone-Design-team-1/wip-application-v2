import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG } from '@constants/color';
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
    backgroundColor: COLOR_BG.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLOR.shadow,
    shadowOffset: { width: 0, height: px(2) },
    shadowOpacity: 0.15,
    shadowRadius: px(4),
    elevation: 4,
  },
  disabled: {
    backgroundColor: COLOR_BG.btnDisabled,
  },
});

export const getKeywordSearchBarStyle = (bottomInset: number) => [
  styles.container,
  { bottom: bottomInset + px(16) },
];
