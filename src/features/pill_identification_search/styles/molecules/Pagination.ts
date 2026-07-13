import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';

export const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pageNavButton: {
    width: px(32),
    height: px(32),
    borderWidth: 2,
    borderColor: COLOR_LINE['border'],
    borderRadius: px(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: px(4),
    backgroundColor: COLOR['white'],
  },
  pageButton: {
    width: px(32),
    height: px(32),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLOR_LINE['border'],
    borderRadius: px(8),
    marginHorizontal: px(4),
    backgroundColor: COLOR['white'],
  },
  pageButtonActive: {
    backgroundColor: COLOR_BG['btnPrimary'],
    borderColor: COLOR['primary'],
  },
  pageButtonText: {
    color: COLOR_TEXT['title'],
  },
  pageButtonTextActive: {
    color: COLOR_TEXT['white'],
  },
});
