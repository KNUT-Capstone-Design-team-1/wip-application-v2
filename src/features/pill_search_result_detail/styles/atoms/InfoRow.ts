import { COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    paddingVertical: px(8),
    borderBottomWidth: px(1),
    borderBottomColor: COLOR_LINE['border'],
  },
  infoLabel: {
    color: COLOR_TEXT['label'],
    width: px(100),
  },
  infoValue: {
    color: COLOR_TEXT['body'],
    flex: 1,
  },
});
