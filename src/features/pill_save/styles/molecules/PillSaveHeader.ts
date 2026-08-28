import { StyleSheet } from 'react-native';
import { COLOR_TEXT, COLOR_LINE } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: px(16),
    paddingHorizontal: px(20),
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LINE.border,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: px(16),
  },
  textBlack: {
    color: COLOR_TEXT.title,
  },
  countText: {
    color: COLOR_TEXT.sub,
  },
});
