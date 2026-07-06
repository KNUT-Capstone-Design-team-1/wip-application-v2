import { COLOR_GRAY } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  infoContainer: {
    paddingHorizontal: px(4),
  },
  infoMoreBtn: {
    borderBottomColor: COLOR_GRAY[100],
    borderBottomWidth: px(1.5),
    marginBottom: px(16),
    paddingVertical: px(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: px(4),
  },
  infoMoreBtnText: {
    color: COLOR_GRAY[300],
    textAlign: 'center',
  },
  detailInfoContainer: {
    paddingBottom: px(200),
  },
});
