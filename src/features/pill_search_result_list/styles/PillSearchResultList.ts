import { StyleSheet } from 'react-native';
import { COLOR, COLOR_GRAY } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  pillSearchResultListRoot: {
    flex: 1,
    backgroundColor: COLOR['white'],
    paddingVertical: px(20),
  },
  searchCountLabel: {
    color: COLOR_GRAY[400],
    includeFontPadding: false,
    textAlignVertical: 'center',
    marginLeft: px(2),
  },
  searchBarWrapper: {
    marginBottom: px(10),
    backgroundColor: COLOR['white'],
    zIndex: 10,
    paddingHorizontal: px(20),
  },
  searchResultInfoWrapper: {
    paddingHorizontal: px(20),
    gap: px(2),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR['white'],
  },
  loadingText: {
    marginTop: px(16),
    color: COLOR_GRAY[400],
  },
});
