import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { screenPadding } from '@constants/size';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_BG['surface'],
    paddingHorizontal: screenPadding.horizontal,
  },
  contentContainer: {},
  hr: {
    width: '100%',
    height: px(2),
    backgroundColor: COLOR_LINE['separator'],
    marginVertical: px(30),
  },
});
