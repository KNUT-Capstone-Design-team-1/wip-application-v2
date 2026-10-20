import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_BG.surface,
    padding: px(8),
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LINE.border,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    minWidth: 0,
    color: COLOR_TEXT.body,
    fontFamily: 'Pretendard',
    fontSize: px(14),
    paddingHorizontal: px(10),
    paddingVertical: px(10),
    backgroundColor: COLOR_BG.base,
    borderRadius: px(8),
  },
  button: {
    width: px(36),
    height: px(44),
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: COLOR_TEXT.sub,
    marginTop: px(4),
    paddingHorizontal: px(10),
  },
});
