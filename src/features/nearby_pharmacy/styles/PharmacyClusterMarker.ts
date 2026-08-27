import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  clusterCaptureFrame: {
    backgroundColor: 'transparent',
  },
  markerWrapper: {
    backgroundColor: COLOR['marker'],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLOR['shadow'],
    shadowOffset: { width: 0, height: px(2) },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  clusterCount: {
    color: COLOR_BG['surface'],
    fontSize: px(13),
    fontWeight: '700',
    includeFontPadding: false,
  },
});
