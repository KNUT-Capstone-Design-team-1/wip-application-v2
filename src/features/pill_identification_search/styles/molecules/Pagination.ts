import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';
import { COLOR, COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';

export const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pageNavButton: {
    width: px(32),
    height: px(32),
    borderWidth: 2,
    borderColor: COLOR_GRAY[150],
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
    borderColor: COLOR_GRAY[150],
    borderRadius: px(8),
    marginHorizontal: px(4),
    backgroundColor: COLOR['white'],
  },
  pageButtonActive: {
    backgroundColor: COLOR_PRIMARY[100],
    borderColor: COLOR_PRIMARY[100],
  },
  pageButtonText: {
    color: COLOR_PRIMARY[400],
  },
  pageButtonTextActive: {
    color: COLOR['white'],
  },
});
