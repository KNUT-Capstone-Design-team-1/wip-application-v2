import { StyleSheet } from 'react-native';
import { COLOR_GRAY, COLOR_PRIMARY } from '@constants/index';
import { FONT_PAPERLOGY_WEIGHT } from '@constants/font';

export const styles = StyleSheet.create({
  searchContainer: {
    width: '100%',
  },
  searchTitle: {
    fontSize: 16,
    color: COLOR_PRIMARY[300],
    marginBottom: 8,
    ...FONT_PAPERLOGY_WEIGHT['regular'],
  },
  scrollView: {
    height: 60,
  },
  notLastSearchPllDataWrapper: {
    flex: 1,
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notLastSearchPllDataText: {
    color: COLOR_GRAY[200],
    ...FONT_PAPERLOGY_WEIGHT['medium'],
  },
  searchTagList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
