import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';
import { COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';

export const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderRadius: px(20),
    paddingLeft: px(16),
    gap: px(4),
  },
  searchContainerDisabled: {
    backgroundColor: COLOR_GRAY[100],
    color: COLOR_GRAY[200],
  },
  searchInput: {
    flex: 1,
    height: px(44),
    fontFamily: 'Paperlogy',
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
    color: '#fff',
    fontSize: fontPx(14),
    fontWeight: '600',
  },
});
