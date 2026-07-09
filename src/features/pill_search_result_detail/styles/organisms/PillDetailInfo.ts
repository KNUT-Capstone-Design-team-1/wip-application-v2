import { COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  infoContainer: {
    paddingHorizontal: px(4),
  },
  infoMoreBtn: {
    borderBottomColor: COLOR_LINE['separator'],
    borderBottomWidth: px(1.5),
    marginBottom: px(16),
    paddingVertical: px(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: px(4),
  },
  infoMoreBtnText: {
    color: COLOR_TEXT['sub'],
    textAlign: 'center',
  },
  detailInfoContainer: {
    paddingBottom: px(200),
  },
});
