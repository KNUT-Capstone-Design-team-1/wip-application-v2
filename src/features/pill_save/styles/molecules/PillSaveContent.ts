import { StyleSheet } from 'react-native';
import { COLOR, COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  pillSaveContentWrapper: {
    flex: 1,
    borderRadius: px(10),
    borderColor: COLOR_GRAY[250],
    borderWidth: px(1),
    backgroundColor: COLOR['white'],
    minHeight: px(190),
    paddingBottom: px(6),
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: px(4),
    right: px(4),
    backgroundColor: COLOR_GRAY[400],
    padding: px(4),
    borderRadius: px(50),
  },
  pillImage: {
    width: '100%',
    height: px(82),
    borderWidth: px(1),
    borderColor: COLOR_GRAY[100],
    marginBottom: px(4),
  },
  pillInfoWrapper: {
    flex: 1,
    paddingHorizontal: px(6),
  },
  pillName: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(12),
    fontWeight: 700,
    color: COLOR['black'],
    marginBottom: px(2),
    lineHeight: fontPx(18),
  },
  pillClassName: {
    fontFamily: 'Paperlogy',
    fontWeight: 600,
    fontSize: fontPx(10),
    color: COLOR['item'],
  },
  pillEntpName: {
    fontFamily: 'Paperlogy',
    fontWeight: 600,
    fontSize: fontPx(10),
    color: COLOR_GRAY[400],
  },
  pillPrintText: {
    fontFamily: 'Paperlogy',
    fontWeight: 600,
    fontSize: fontPx(10),
    color: COLOR_PRIMARY[400],
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
    backgroundColor: COLOR_GRAY[200],
    marginHorizontal: px(8),
  },
  pillInfoEntpWrapper: {
    flexGrow: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});
