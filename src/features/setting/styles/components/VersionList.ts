import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR_TEXT, COLOR_LINE } from '@constants/color';

export const styles = StyleSheet.create({
  loadingContainer: {
    paddingVertical: px(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    paddingVertical: px(20),
    alignItems: 'center',
  },
  emptyText: {
    color: COLOR_TEXT['disabled'],
  },
  separator: {
    height: 1,
    backgroundColor: COLOR_LINE['border'],
    marginHorizontal: px(8),
  },
});
