import { COLOR_LINE } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  sectionDivider: {
    marginVertical: px(16),
    borderBottomWidth: px(1),
    borderBottomColor: COLOR_LINE['separator'],
  },
});
