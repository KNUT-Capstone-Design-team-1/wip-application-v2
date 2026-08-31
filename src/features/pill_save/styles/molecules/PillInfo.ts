import { StyleSheet } from 'react-native';
import { COLOR, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
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
