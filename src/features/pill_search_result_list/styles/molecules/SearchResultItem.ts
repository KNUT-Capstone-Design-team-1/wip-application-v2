import { StyleSheet } from 'react-native';
import { COLOR, COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';
import { px } from '@utils/responsive';

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
    paddingVertical: px(2),
    gap: px(4),
  },
  searchItemTitle: {},
  searchItemClassName: {
    color: COLOR['item'],
  },
  searchItemEtcOtcCode: {
    color: COLOR['item'],
  },
  searchItemEntpName: {
    color: COLOR_GRAY[400],
  },
  searchItemPrintText: {
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
    color: COLOR_PRIMARY[400],
  },
  infoTitleWrapper: {
    gap: px(1),
  },
  infoPrintWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoSeparator: {
    width: px(2),
    height: '60%',
    backgroundColor: COLOR_GRAY[200],
    marginHorizontal: px(8),
  },
  infoEntpWrapper: {
    flexGrow: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});
