import { StyleSheet } from 'react-native';
import { COLOR_GRAY, COLOR_PRIMARY } from '@constants/index';

export const styles = StyleSheet.create({
  searchContainer: {
    width: '100%',
    marginTop: 20,
  },
  searchTitle: {
    fontSize: 16,
    color: COLOR_PRIMARY[300],
    marginBottom: 15,
  },
  scrollView: {
    minHeight: 50,
    maxHeight: 120,
  },
  notLastSearchPllDataWrapper: {
    flex: 1,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notLastSearchPllDataText: {
    fontWeight: 600,
    color: COLOR_GRAY[300],
  },
  searchTagList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
