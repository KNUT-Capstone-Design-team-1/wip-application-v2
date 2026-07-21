import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: px(16),
  },
  paginationButton: {
    paddingVertical: px(10),
    paddingHorizontal: px(20),
    backgroundColor: COLOR['secondary'],
    borderRadius: px(8),
    minWidth: px(80),
    alignItems: 'center',
  },
  paginationButtonDisabled: {
    backgroundColor: COLOR_BG['btnDisabled'],
  },
  paginationButtonText: {
    color: COLOR_TEXT['white'],
  },
  paginationButtonTextDisabled: {
    color: COLOR_TEXT['disabled'],
  },
  pageIndicator: {
    color: COLOR_TEXT['body'],
  },
});
