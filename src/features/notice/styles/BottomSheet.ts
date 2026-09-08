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
    backgroundColor: COLOR_BG['sheetNotice'],
    borderTopRightRadius: px(24),
    borderTopLeftRadius: px(24),
    overflow: 'hidden',
  },
  flatList: {
    flexGrow: 0,
    height: px(180),
  },
  slideItem: {
    height: px(180),
    justifyContent: 'space-between',
    paddingTop: px(10),
    paddingBottom: px(8),
    paddingHorizontal: px(16),
  },
  slideContent: {
    gap: px(6),
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: px(16),
    paddingBottom: px(4),
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
    paddingTop: px(12),
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
    lineHeight: px(20),
  },
  detailButton: {
    alignSelf: 'flex-end',
    paddingVertical: px(4),
    paddingHorizontal: px(4),
    marginTop: px(8),
  },
  detailButtonText: {
    color: COLOR['white'],
    borderBottomWidth: px(1),
    borderBottomColor: COLOR['white'],
    paddingBottom: px(2),
  },
});
