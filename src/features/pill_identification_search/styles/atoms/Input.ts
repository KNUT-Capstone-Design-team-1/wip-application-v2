import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';
import { COLOR_BG, COLOR_TEXT } from '@constants/color';

export const styles = StyleSheet.create({
  inputWrapper: {
    borderColor: 'transparent',
    borderRadius: px(10),
    borderWidth: px(1.5),
    paddingHorizontal: px(10),
    justifyContent: 'center',
    backgroundColor: COLOR_BG['base'],
  },
  input: {
    fontFamily: 'Pretendard',
    color: COLOR_TEXT['body'],
    fontSize: fontPx(14),
    fontWeight: 500,
    height: '100%',
    includeFontPadding: false,
    paddingVertical: px(0),
    textAlignVertical: 'center',
  },
});
