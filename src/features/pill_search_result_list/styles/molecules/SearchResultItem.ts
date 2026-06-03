import { StyleSheet } from 'react-native';
import { COLOR, COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';

export const styles = StyleSheet.create({
  searchItemWrapper: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 16,
    gap: 12,
  },
  searchItemImage: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: COLOR_GRAY[100],
    borderRadius: 10,
    overflow: 'hidden', // 이미지가 borderRadius 밖으로 나가지 않도록
  },
  searchItemContents: {
    flex: 1,
    gap: 1,
    // justifyContent: 'space-between',
  },
  searchItemTitle: {
    fontFamily: 'Paperlogy',
    fontWeight: 700,
    fontSize: 14,
  },
  searchItemClassName: {
    fontFamily: 'Paperlogy',
    fontWeight: 600,
    fontSize: 12,
    color: COLOR['item'],
  },
  searchItemEtcOtcCode: {
    fontFamily: 'Paperlogy',
    fontWeight: 600,
    fontSize: 11,
    color: COLOR['item'],
  },
  searchItemEntpName: {
    fontFamily: 'Paperlogy',
    fontWeight: 600,
    fontSize: 11,
    color: COLOR_GRAY[400],
  },
  searchItemPrintText: {
    fontFamily: 'Paperlogy',
    fontWeight: 600,
    fontSize: 11,
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
    fontSize: 14,
  },
  infoPrintWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoSeparator: {
    width: 2,
    height: '60%',
    backgroundColor: COLOR_GRAY[200],
    marginHorizontal: 8,
  },
  infoEntpWrapper: {
    flexGrow: 1,
    gap: 1,
    alignItems: 'flex-end',
  },
});
