import { StyleSheet } from 'react-native';
import { COLOR } from '@constants/color';
import { px } from '@utils/responsive';

const buttonSize = px(44, 44, 48);

export const styles = StyleSheet.create({
  button: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    backgroundColor: COLOR.primary,
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.35 },
});
