import { COLOR, COLOR_PRIMARY } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  detailSectionWrapper: {},
  detailInfoHeadWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: px(10),
    paddingVertical: px(4),
  },
  detailInfoHeadText: {
    fontFamily: 'Paperlogy',
    color: COLOR_PRIMARY[200],
    fontSize: fontPx(18),
    fontWeight: 700,
    flex: 1,
  },
  detailInfoContent: {
    paddingVertical: px(4),
    paddingHorizontal: px(4),
    backgroundColor: COLOR['white'],
    borderRadius: px(8),
  },
  detailInfoText: {
    fontFamily: 'Paperlogy',
    fontWeight: 500,
    color: COLOR['black'],
    fontSize: fontPx(16),
    lineHeight: px(30),
  },
});
