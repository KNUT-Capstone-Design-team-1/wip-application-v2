import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { screenPadding } from '@constants/size';

export const styles = StyleSheet.create({
  detailSectionWrapper: {
    marginTop: px(8),
    backgroundColor: COLOR_BG['surface'],
    paddingHorizontal: screenPadding.horizontal,
    paddingVertical: px(16),
  },
  detailInfoHeadWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: px(10),
  },
  detailInfoHeadText: {
    color: COLOR_TEXT['subTitle'],
    flex: 1,
  },
  detailInfoContent: {
    paddingTop: px(16),
    paddingHorizontal: px(4),
  },
  detailInfoText: {
    color: COLOR['black'],
    lineHeight: px(28),
  },
});
