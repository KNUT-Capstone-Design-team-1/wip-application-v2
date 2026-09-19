import { COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: px(22),
  },
  itemTextBtn: {
    flex: 1,
    flexShrink: 1,
  },
  itemTextPlaceholder: {
    paddingVertical: px(12),
  },
  itemText: {
    color: COLOR_TEXT['title'],
  },
});
