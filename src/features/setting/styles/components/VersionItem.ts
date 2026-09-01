import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR_TEXT } from '@constants/color';

export const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: px(16),
    paddingLeft: px(8),
    justifyContent: 'center',
  },
  label: {
    color: COLOR_TEXT['title'],
    marginBottom: px(4),
  },
  value: {
    color: COLOR_TEXT['sub'],
  },
});
