import { StyleSheet } from 'react-native';
import { COLOR } from '@constants/color';
import { screenPadding } from '@constants/size';
import { px } from '@utils/responsive';

const buttonSize = px(36, 36, 40);

export const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: px(16),
    right: screenPadding.horizontal,
    zIndex: 10,
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    backgroundColor: COLOR.primary,
    opacity: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
