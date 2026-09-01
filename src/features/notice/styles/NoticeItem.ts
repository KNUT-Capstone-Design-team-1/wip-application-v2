import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';

export const styles = StyleSheet.create({
  noticeDataWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLOR_BG['surface'],
    paddingVertical: px(8),
  },
  noticeTitle: {
    color: COLOR_TEXT['title'],
    marginBottom: px(4),
  },
  noticeDate: {
    color: COLOR_TEXT['sub'],
  },
  badge: {
    backgroundColor: COLOR_BG['btnPrimary'],
    paddingHorizontal: px(8),
    paddingVertical: px(4),
    borderRadius: px(4),
  },
  badgeText: {
    color: COLOR_TEXT['white'],
  },
  noticeInfoContainer: { flex: 1, marginRight: px(10) },
});
