import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { fontPx, px } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_BG.surface,
    paddingHorizontal: px(8),
    paddingVertical: px(2),
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LINE.border,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  inputWrapper: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR_BG.base,
    borderRadius: px(8),
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: px(36),
    textAlignVertical: 'center',
    color: COLOR_TEXT.body,
    fontFamily: 'Pretendard',
    fontSize: px(14),
    paddingHorizontal: px(10),
    paddingVertical: 0,
  },
  button: {
    width: px(36),
    height: px(36),
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: COLOR_TEXT.sub,
    lineHeight: fontPx(14),
    marginTop: px(2),
    paddingHorizontal: px(10),
  },
});
