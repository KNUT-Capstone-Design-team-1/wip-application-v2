import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  pillSaveRoot: {
    flex: 1,
    backgroundColor: COLOR_BG['surface'],
    paddingHorizontal: px(8),
  },

  countText: {
    color: COLOR_TEXT['sub'],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR_BG['surface'],
  },
  loadingText: {
    marginTop: px(12),
    color: COLOR_TEXT['sub'],
  },
  container: { flex: 1 },
});
