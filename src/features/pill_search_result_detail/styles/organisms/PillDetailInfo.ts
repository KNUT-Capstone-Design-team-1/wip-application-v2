import { COLOR_BG, COLOR_TEXT } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  infoContainer: {},
  infoMoreBtn: {
    marginBottom: px(8),
    paddingVertical: px(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: px(4),
    backgroundColor: COLOR_BG['surface'],
  },
  infoMoreBtnText: {
    color: COLOR_TEXT['sub'],
    textAlign: 'center',
  },
  detailInfoContainer: {
    paddingBottom: px(20),
  },
  iconPlaceholder: { width: 24, height: 24 }, // will be adjusted with fontPx if needed
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { marginTop: 16, color: COLOR_TEXT['sub'] },
});
