import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
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
    backgroundColor: COLOR_BG['overlay'],
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    minHeight: px(280),
    maxHeight: '45%',
    backgroundColor: COLOR_BG['sheetNotice'],
    borderTopRightRadius: px(24),
    borderTopLeftRadius: px(24),
    overflow: 'hidden',
  },
  flatList: {
    flex: 1,
  },
  slideItem: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: px(12),
    paddingBottom: px(12),
  },
  slideContent: {
    gap: px(8),
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
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: px(16),
    paddingTop: px(10),
    backgroundColor: COLOR_BG['surface'],
  },
  sheetCloseTodayText: {
    color: COLOR_TEXT['body'],
  },
  sheetCloseButtonText: {
    color: COLOR_TEXT['body'],
  },
  title: {
    color: COLOR_TEXT['white'],
  },
  contents: {
    color: COLOR_TEXT['white'],
  },
  detailButton: {
    alignSelf: 'flex-end',
    paddingVertical: px(4),
    paddingHorizontal: px(8),
    marginTop: px(4),
  },
  detailButtonText: {
    color: COLOR['white'],
    borderBottomWidth: px(1),
    borderBottomColor: COLOR['white'],
    paddingBottom: px(2),
  },
});
