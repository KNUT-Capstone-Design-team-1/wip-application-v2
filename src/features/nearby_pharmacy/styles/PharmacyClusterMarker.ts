import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  outerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  markerWrapper: {
    backgroundColor: COLOR['marker'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  clusterCount: {
    color: COLOR_BG['surface'],
    fontSize: px(13),
    fontWeight: '700',
    includeFontPadding: false,
  },
});
