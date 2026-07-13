import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  pillSaveContentWrapper: {
    flex: 1,
    borderRadius: px(10),
    borderColor: COLOR_LINE['border'],
    borderWidth: px(1),
    backgroundColor: COLOR_BG['surface'],
    minHeight: px(190),
    paddingBottom: px(6),
    overflow: 'hidden',
    shadowColor: COLOR['shadow'],
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  closeButton: {
    position: 'absolute',
    top: px(4),
    right: px(4),
    backgroundColor: COLOR_BG['btnGray'],
    padding: px(4),
    borderRadius: px(50),
  },
  pillImage: {
    width: '100%',
    height: px(82),
    borderWidth: px(1),
    borderColor: COLOR_LINE['border'],
    marginBottom: px(4),
  },
  pillInfoWrapper: {
    flex: 1,
    paddingHorizontal: px(6),
  },
  pillName: {
    color: COLOR_TEXT['title'],
    marginBottom: px(2),
    lineHeight: fontPx(18),
  },
  pillClassName: {
    color: COLOR['item'],
  },
  pillEntpName: {
    color: COLOR_TEXT['label'],
  },
  pillPrintText: {
    color: COLOR_TEXT['body'],
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  pillInfoPrintWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: px(2),
  },
  pillInfoSeparator: {
    width: px(2),
    height: '60%',
    backgroundColor: COLOR_LINE['separator'],
    marginHorizontal: px(8),
  },
  pillInfoEntpWrapper: {
    flexGrow: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});
