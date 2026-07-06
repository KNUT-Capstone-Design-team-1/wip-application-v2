import { StyleSheet } from 'react-native';
import { COLOR, COLOR_PRIMARY } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  bottomSheetContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  darkBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: COLOR['black'],
    opacity: 0.5,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '38%',
    backgroundColor: COLOR_PRIMARY['300'],
    borderTopRightRadius: px(24),
    borderTopLeftRadius: px(24),
  },
  flatList: {
    flex: 1,
  },
  slideItem: {
    justifyContent: 'flex-start',
    paddingTop: px(16),
    gap: px(20),
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: px(16),
    gap: px(8),
  },
  dot: {
    width: px(6),
    height: px(6),
    borderRadius: px(4),
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    backgroundColor: COLOR['white'],
    width: px(24),
  },
  bottomSheetControl: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding: px(16),
    paddingHorizontal: px(16),
    paddingVertical: px(8),
    backgroundColor: COLOR['white'],
  },
  sheetCloseToday: {
    color: COLOR_PRIMARY[300],
  },
  sheetCloseButton: {
    color: COLOR['black'],
  },
  title: {
    color: COLOR['white'],
  },
  contents: {
    color: COLOR['white'],
  },
  detailButton: {
    position: 'absolute',
    bottom: px(74),
    right: px(16),
    paddingVertical: px(8),
    paddingHorizontal: px(12),
    zIndex: 10,
  },
  detailButtonText: {
    color: COLOR['white'],
    borderBottomWidth: px(1),
    borderBottomColor: COLOR['white'],
    paddingBottom: px(2),
  },
});
