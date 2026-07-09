import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';
import { COLOR_BG, COLOR_TEXT } from '@constants/color';

export const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderRadius: px(20),
    paddingLeft: px(16),
    gap: px(4),
  },
  searchContainerDisabled: {
    backgroundColor: COLOR_BG['btnDisabled'],
    color: COLOR_TEXT['disabled'],
  },
  searchInput: {
    flex: 1,
    height: px(44),
    fontFamily: 'Pretendard',
    fontWeight: 600,
    fontSize: fontPx(14),
  },
  searchButton: {
    width: px(42),
    height: px(42),
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: COLOR_TEXT['white'],
    fontSize: fontPx(14),
    fontWeight: '600',
  },
});
