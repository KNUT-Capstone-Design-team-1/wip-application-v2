import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { screenPadding } from '@constants/size';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_BG.surface,
    paddingLeft: screenPadding.horizontal,
    paddingRight: screenPadding.horizontal,
    paddingTop: px(-10),
    paddingBottom: px(10),
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
  clearButton: {
    width: px(20),
    height: px(20),
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rightIcon: {
    width: px(36),
    height: px(36),
    paddingHorizontal: px(8),
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
