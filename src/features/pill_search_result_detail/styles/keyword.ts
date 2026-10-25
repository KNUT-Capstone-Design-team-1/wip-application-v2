import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  highlight: {
    backgroundColor: COLOR_BG.highlight,
    color: COLOR_TEXT.highlight,
  },
  row: {
    flexDirection: 'row',
    gap: px(8),
    paddingVertical: px(8),
    borderBottomWidth: px(1),
    borderBottomColor: COLOR_LINE.border,
  },
  label: {
    color: COLOR_TEXT.label,
    width: px(100),
  },
  value: {
    color: COLOR_TEXT.body,
    flex: 1,
  },
});
