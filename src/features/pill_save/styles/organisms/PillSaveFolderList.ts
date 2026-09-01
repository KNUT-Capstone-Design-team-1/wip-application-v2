import { StyleSheet } from 'react-native';
import { COLOR_LINE } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: COLOR_LINE.border,
    marginVertical: px(0),
  },
  listContent: {
    paddingHorizontal: px(12),
    paddingTop: 0,
    paddingBottom: px(100),
  },
});
