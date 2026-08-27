import { StyleSheet } from 'react-native';
import { COLOR_LINE } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  pillImage: {
    width: '100%',
    height: px(82),
    borderWidth: px(1),
    borderColor: COLOR_LINE['border'],
    borderTopLeftRadius: px(10),
    borderTopRightRadius: px(10),
    marginBottom: px(4),
  },
});
