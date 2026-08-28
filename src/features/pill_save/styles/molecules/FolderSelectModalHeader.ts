import { StyleSheet } from 'react-native';
import { COLOR_TEXT, COLOR_LINE } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: px(12),
    marginHorizontal: px(20),
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LINE['border'],
  },
  title: {
    color: COLOR_TEXT['title'],
  },
  closeBtn: {
    padding: px(4),
  },
});
