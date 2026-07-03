import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  searchResultListContainer: {
    flex: 1,
    paddingHorizontal: px(14),
  },
  searchResultListWrapper: {
    marginTop: px(8),
    flexDirection: 'column',
  },
  searchResultListContentContainer: {
    paddingLeft: px(8),
    paddingRight: px(12),
  },
  searchResultListItemWrapper: {},
  hr: {
    width: '100%',
    height: px(1),
    backgroundColor: COLOR_GRAY[100],
  },
  searchResultListLoadingWrapper: {
    paddingVertical: px(20),
    height: px(100),
  },
});
