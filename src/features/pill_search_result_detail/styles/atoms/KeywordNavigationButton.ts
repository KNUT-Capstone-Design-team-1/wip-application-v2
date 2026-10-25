import { StyleSheet } from 'react-native';
import { COLOR } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  button: {
    height: px(44),
    borderRadius: px(22),
    backgroundColor: COLOR.primary,
    elevation: 3,
    opacity: 0.95,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.5 },
});
