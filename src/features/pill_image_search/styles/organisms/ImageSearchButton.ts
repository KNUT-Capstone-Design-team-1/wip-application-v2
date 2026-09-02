import { COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  buttonWrapper: {
    justifyContent: 'flex-end',
  },
  searchButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: px(8),
    width: '100%',
    height: px(48),
    borderRadius: px(10),
    backgroundColor: COLOR_BG['btnPrimary'],
  },
  searchButtonText: {
    color: COLOR_TEXT['white'],
  },
});
