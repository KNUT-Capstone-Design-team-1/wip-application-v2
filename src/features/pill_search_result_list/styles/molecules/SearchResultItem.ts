import { StyleSheet } from 'react-native';
import { COLOR, COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  searchItemWrapper: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: px(16),
    gap: px(12),
  },
  searchItemImage: {
    width: px(100),
    height: px(100),
    borderWidth: px(1),
    borderColor: COLOR_GRAY[100],
    borderRadius: px(10),
    overflow: 'hidden', // 이미지가 borderRadius 밖으로 나가지 않도록
  },
  searchItemContents: {
    flex: 1,
    gap: px(1),
    // justifyContent: 'space-between',
  },
  searchItemTitle: {
    fontFamily: 'Paperlogy',
    fontWeight: 700,
    fontSize: fontPx(14),
  },
  searchItemClassName: {
    fontFamily: 'Paperlogy',
    fontWeight: 600,
    fontSize: fontPx(12),
    color: COLOR['item'],
  },
  searchItemEtcOtcCode: {
    fontFamily: 'Paperlogy',
    fontWeight: 600,
    fontSize: fontPx(11),
    color: COLOR['item'],
  },
  searchItemEntpName: {
    fontFamily: 'Paperlogy',
    fontWeight: 600,
    fontSize: fontPx(11),
    color: COLOR_GRAY[400],
  },
  searchItemPrintText: {
    fontFamily: 'Paperlogy',
    fontWeight: 600,
    fontSize: fontPx(11),
    color: COLOR_PRIMARY[400],
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  fallbackImageContainer: {
    flex: 1,
    backgroundColor: COLOR_GRAY[150],
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackImageText: {
    fontFamily: 'Paperlogy',
    fontWeight: 600,
    color: COLOR_PRIMARY[400],
    fontSize: fontPx(14),
  },
  infoPrintWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: px(4),
  },
  infoSeparator: {
    width: px(2),
    height: '60%',
    backgroundColor: COLOR_GRAY[200],
    marginHorizontal: px(8),
  },
  infoEntpWrapper: {
    flexGrow: 1,
    gap: px(1),
    alignItems: 'flex-end',
  },
});
