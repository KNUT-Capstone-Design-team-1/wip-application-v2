import { StyleSheet } from 'react-native';
import { COLOR_TEXT } from '@constants/index';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  searchContainer: {
    width: '100%',
  },
  searchTitle: {
    color: COLOR_TEXT['subTitle'],
    marginBottom: px(8),
  },
  scrollView: {
    flexGrow: 0,
    paddingLeft: px(4),
    paddingTop: px(8),
    paddingBottom: px(12),
  },
  notLastViewedPllDataWrapper: {
    flex: 1,
    height: px(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  notLastViewedPllDataText: {
    color: COLOR_TEXT['disabled'],
  },
  searchTagList: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(8),
    paddingRight: px(16),
    minHeight: px(32),
  },
});
