import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR } from '@constants/color';

export const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: px(5),
    borderRadius: px(14),
    borderColor: COLOR['primary'],
    borderWidth: 1,
  },
  label: {},
});
