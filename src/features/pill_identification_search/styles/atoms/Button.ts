import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';
import { COLOR_PRIMARY } from '@constants/color';

export const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: px(5),
    borderRadius: px(14),
    borderColor: COLOR_PRIMARY[100],
    borderWidth: 1,
  },
  label: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(18),
    fontWeight: 700,
  },
});
