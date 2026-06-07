import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';
import { COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';

export const styles = StyleSheet.create({
  inputWrapper: {
    borderColor: COLOR_GRAY[250],
    borderRadius: px(10),
    borderWidth: 1,
    paddingHorizontal: px(10),
    justifyContent: 'center',
  },
  input: {
    fontFamily: 'Paperlogy',
    color: COLOR_PRIMARY[400],
    fontSize: fontPx(14),
    fontWeight: 500,
    height: '100%',
    includeFontPadding: false,
    paddingVertical: px(0),
    textAlignVertical: 'center',
  },
});
