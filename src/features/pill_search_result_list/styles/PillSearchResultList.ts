import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  pillSearchResultListRoot: {
    flex: 1,
    backgroundColor: COLOR_BG['surface'],
  },
  searchCountLabel: {
    color: COLOR_TEXT['sub'],
    includeFontPadding: false,
    textAlignVertical: 'center',
    marginLeft: px(2),
  },
  searchResultInfoWrapper: {
    paddingHorizontal: px(20),
    gap: px(2),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR_BG['surface'],
  },
  loadingText: {
    marginTop: px(16),
    color: COLOR_TEXT['sub'],
  },
});
