import { StyleSheet } from 'react-native';
import { COLOR_TEXT, COLOR_LINE } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: px(24),
    paddingTop: 0,
    paddingBottom: px(12),
    marginHorizontal: px(12),
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LINE.border,
  },

  countText: {
    color: COLOR_TEXT.sub,
  },
});
