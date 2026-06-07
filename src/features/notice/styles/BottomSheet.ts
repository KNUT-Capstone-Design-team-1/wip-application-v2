import { StyleSheet } from 'react-native';
import { COLOR_PRIMARY } from '@constants/color';
import { px, fontPx } from '@utils/responsive';

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
    backgroundColor: '#000',
    opacity: 0.5,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '42%',
    backgroundColor: COLOR_PRIMARY['300'],
    borderTopRightRadius: px(30),
    borderTopLeftRadius: px(30),
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
    paddingTop: px(20),
    gap: px(8),
  },
  dot: {
    width: px(8),
    height: px(8),
    borderRadius: px(4),
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    backgroundColor: '#fff',
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
    padding: px(16),
    backgroundColor: '#fff',
    color: '#444',
  },
  sheetCloseToday: {
    color: 'grey',
  },
  title: {
    fontFamily: 'Paperlogy',
    fontWeight: 700,
    fontSize: fontPx(18),
    color: '#fff',
  },
  contents: {
    fontFamily: 'Paperlogy',
    fontWeight: 500,
    fontSize: fontPx(12),
    color: '#e3e3e3',
  },
  detailButton: {
    position: 'absolute',
    bottom: px(80),
    right: px(16),
    paddingVertical: px(8),
    paddingHorizontal: px(12),
    zIndex: 10,
  },
  detailButtonText: {
    fontFamily: 'Paperlogy',
    fontWeight: 500,
    color: '#fff',
    fontSize: fontPx(14),
    borderBottomWidth: px(1),
    borderBottomColor: '#fff',
    paddingBottom: px(2),
  },
});
