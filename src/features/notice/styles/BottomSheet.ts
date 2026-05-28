import { StyleSheet } from 'react-native';
import { COLOR_PRIMARY } from '@constants/color';

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
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  flatList: {
    flex: 1,
  },
  slideItem: {
    justifyContent: 'flex-start',
    paddingTop: 16,
    gap: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 24,
  },
  bottomSheetControl: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    color: '#444',
  },
  sheetCloseToday: {
    color: 'grey',
  },
  title: {
    fontFamily: 'Paperlogy',
    fontWeight: 700,
    fontSize: 18,
    color: '#fff',
  },
  contents: {
    fontFamily: 'Paperlogy',
    fontWeight: 500,
    fontSize: 12,
    color: '#e3e3e3',
  },
  detailButton: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 10,
  },
  detailButtonText: {
    fontFamily: 'Paperlogy',
    fontWeight: 500,
    color: '#fff',
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingBottom: 2,
  },
});
