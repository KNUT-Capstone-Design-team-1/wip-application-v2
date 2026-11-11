import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { fontPx, px } from '@utils/responsive';

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
    borderColor: COLOR_LINE['border'],
    borderRadius: px(10),
    overflow: 'hidden', // 이미지가 borderRadius 밖으로 나가지 않도록
    backgroundColor: COLOR_BG['base'],
  },
  searchItemContents: {
    flex: 1,
    paddingVertical: px(2),
    gap: px(4),
  },
  searchItemTitle: {},
  searchItemEtcOtcCode: {
    color: COLOR['item'],
  },
  searchItemEffectKeyword: {
    color: COLOR_TEXT['body'],
  },
  searchItemPrintText: {
    color: COLOR_TEXT['body'],
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  fallbackImageContainer: {
    flex: 1,
    backgroundColor: COLOR_BG['base'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTitleWrapper: {},
  infoPrintWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoSeparator: {
    width: px(1),
    height: px(10),
    backgroundColor: COLOR_LINE['separator'],
    marginHorizontal: px(8),
  },
  infoBottomWrapper: {
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  image: { width: '100%', height: '100%' },
});
