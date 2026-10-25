import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_TEXT } from '@constants/color';
import { screenPadding } from '@constants/size';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  infoWrapper: {
    gap: px(2),
    paddingTop: px(12),
    paddingHorizontal: screenPadding.horizontal,
    backgroundColor: COLOR_BG['surface'],
  },
  sectionTitle: {
    color: COLOR_TEXT['subTitle'],
    textAlign: 'left',
    marginBottom: px(4),
    marginTop: px(12),
  },
});
