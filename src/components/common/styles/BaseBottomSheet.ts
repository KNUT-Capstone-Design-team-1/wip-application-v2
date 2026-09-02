import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLOR_BG['overlay'],
  },
  sheetContainer: {
    width: '100%',
    backgroundColor: COLOR_BG['surface'],
    borderTopLeftRadius: px(24),
    borderTopRightRadius: px(24),
    shadowColor: COLOR['shadow'],
    shadowOffset: {
      width: 0,
      height: px(-4),
    },
    shadowOpacity: 0.15,
    shadowRadius: px(12),
    elevation: 10,
    overflow: 'hidden',
  },
  grabberContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: px(12),
  },
  grabber: {
    width: px(40),
    height: px(4),
    backgroundColor: COLOR_LINE['separator'],
    borderRadius: px(2),
  },
});
