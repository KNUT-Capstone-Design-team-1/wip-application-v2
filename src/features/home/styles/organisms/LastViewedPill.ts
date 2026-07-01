import { StyleSheet } from 'react-native';
import { COLOR_GRAY, COLOR_PRIMARY } from '@constants/index';
import { FONT_PAPERLOGY_WEIGHT } from '@constants/font';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  searchContainer: {
    width: '100%',
  },
  searchTitle: {
    fontSize: fontPx(16),
    color: COLOR_PRIMARY[300],
    marginBottom: px(8),
    ...FONT_PAPERLOGY_WEIGHT['regular'],
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
    color: COLOR_GRAY[200],
    ...FONT_PAPERLOGY_WEIGHT['medium'],
  },
  searchTagList: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(8),
    paddingRight: px(16),
  },
});
