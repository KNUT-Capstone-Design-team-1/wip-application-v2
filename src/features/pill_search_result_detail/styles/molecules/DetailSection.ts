import { COLOR, COLOR_PRIMARY } from '@constants/color';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  detailSectionWrapper: {},
  detailInfoHeadWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  detailInfoHeadText: {
    fontFamily: 'Paperlogy',
    color: COLOR_PRIMARY[200],
    fontSize: 18,
    fontWeight: 700,
    flex: 1,
  },
  detailInfoContent: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: COLOR['white'],
    borderRadius: 8,
  },
  detailInfoText: {
    fontFamily: 'Paperlogy',
    fontWeight: 500,
    color: COLOR['black'],
    fontSize: 16,
    lineHeight: 30,
  },
});
