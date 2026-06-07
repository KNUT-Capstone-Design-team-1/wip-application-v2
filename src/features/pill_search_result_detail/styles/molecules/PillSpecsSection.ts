import { COLOR_PRIMARY } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  infoWrapper: {
    gap: px(2),
    paddingBottom: px(0),
    paddingVertical: px(12),
  },
  sectionTitle: {
    fontFamily: 'Paperlogy',
    color: COLOR_PRIMARY[200],
    fontSize: fontPx(16),
    fontWeight: 700,
    textAlign: 'left',
    marginBottom: px(4),
    marginTop: px(12),
  },
});
