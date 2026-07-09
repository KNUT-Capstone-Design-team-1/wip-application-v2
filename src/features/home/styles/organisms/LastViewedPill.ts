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
  },
  notLastViewedPllDataWrapper: {
    flex: 1,
    height: px(60),
    display: 'flex',
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
  },
});
