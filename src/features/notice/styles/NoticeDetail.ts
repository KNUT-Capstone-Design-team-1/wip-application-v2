import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR_BG } from '@constants/color';
import { screenPadding } from '@constants/size';

export const styles = StyleSheet.create({
  scrollViewWrapper: {
    backgroundColor: COLOR_BG['surface'],
    flex: 1,
    paddingHorizontal: screenPadding.horizontal,
    paddingTop: screenPadding.top,
    paddingBottom: px(20),
  },
});
