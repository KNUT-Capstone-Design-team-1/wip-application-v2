import { COLOR, COLOR_PRIMARY } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  detailSectionWrapper: {},
  detailInfoHeadWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: px(10),
    paddingVertical: px(4),
  },
  detailInfoHeadText: {
    color: COLOR_PRIMARY[200],
    flex: 1,
  },
  detailInfoContent: {
    paddingVertical: px(4),
    paddingHorizontal: px(4),
    backgroundColor: COLOR['white'],
    borderRadius: px(8),
  },
  detailInfoText: {
    color: COLOR['black'],
    lineHeight: px(30),
  },
});
