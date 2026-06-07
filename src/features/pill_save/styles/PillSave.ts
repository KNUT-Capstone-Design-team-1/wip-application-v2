import { StyleSheet } from 'react-native';
import { COLOR, COLOR_GRAY } from '@constants/color';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  pillSaveRoot: {
    flex: 1,
    backgroundColor: COLOR['white'],
    paddingHorizontal: px(8),
  },
  header: {
    paddingVertical: px(12),
    marginHorizontal: px(12),
    borderBottomWidth: px(1),
    borderBottomColor: COLOR_GRAY[100],
  },
  countText: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(14),
    color: COLOR_GRAY[400],
    fontWeight: 600,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR['white'],
  },
  loadingText: {
    fontFamily: 'Paperlogy',
    marginTop: px(12),
    fontSize: fontPx(16),
    fontWeight: 700,
    color: COLOR_GRAY[400],
  },
});
