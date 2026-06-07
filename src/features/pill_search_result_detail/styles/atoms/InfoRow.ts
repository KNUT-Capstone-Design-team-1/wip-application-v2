import { COLOR, COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    paddingVertical: px(8),
    borderBottomWidth: px(1),
    borderBottomColor: COLOR_GRAY[100],
  },
  infoLabel: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(14),
    fontWeight: 600,
    color: COLOR_PRIMARY[400],
    width: px(100),
  },
  infoValue: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(14),
    fontWeight: 500,
    color: COLOR['black'],
    flex: 1,
  },
});
