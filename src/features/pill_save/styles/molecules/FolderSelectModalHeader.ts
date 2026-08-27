import { StyleSheet } from 'react-native';
import { COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: px(20),
  },
  title: {
    color: COLOR_TEXT['title'],
  },
  closeBtn: {
    padding: px(4),
  },
});
