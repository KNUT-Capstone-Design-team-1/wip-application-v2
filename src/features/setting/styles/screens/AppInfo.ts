import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR_BG } from '@constants/color';
import { screenPadding } from '@constants/size';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_BG['surface'],
  },
  contentContainer: {
    paddingHorizontal: screenPadding.horizontal,
    paddingTop: screenPadding.top,
    paddingBottom: px(40),
  },
});
