import { StyleSheet } from 'react-native';
import { COLOR } from '@constants/color';
import { screenPadding } from '@constants/size';
import { px } from '@utils/responsive';
import { KEYWORD_HIGHLIGHT_STYLE } from '../../constants/keyword_highlight';

const buttonSize = px(36, 36, 40);

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
    backgroundColor: KEYWORD_HIGHLIGHT_STYLE.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLOR.shadow,
    shadowOffset: { width: 0, height: px(2) },
    shadowOpacity: 0.15,
    shadowRadius: px(4),
    elevation: 4,
  },
  disabled: { opacity: 0.4 },
});
