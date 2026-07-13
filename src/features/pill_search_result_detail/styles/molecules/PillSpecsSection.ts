import { COLOR_BG, COLOR_TEXT } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { screenPadding } from '@constants/size';

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
