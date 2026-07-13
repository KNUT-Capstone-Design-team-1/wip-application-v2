import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  pillSaveRoot: {
    flex: 1,
    backgroundColor: COLOR_BG['surface'],
    paddingHorizontal: px(8),
  },
  header: {
    paddingBottom: px(12),
    marginHorizontal: px(12),
    borderBottomWidth: px(1),
    borderBottomColor: COLOR_LINE['separator'],
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
});
