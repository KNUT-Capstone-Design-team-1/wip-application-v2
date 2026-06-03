import { StyleSheet } from 'react-native';
import { COLOR, COLOR_GRAY } from '@constants/color';

export const styles = StyleSheet.create({
  pillSearchResultListRoot: {
    flex: 1,
    backgroundColor: COLOR['white'],
    padding: 20,
  },
  searchCountLabel: {
    fontFamily: 'Paperlogy',
    fontWeight: 500,
    color: COLOR_GRAY[400],
    fontSize: 12,
  },
  searchBarWrapper: {
    marginBottom: 10,
    backgroundColor: COLOR['white'],
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR['white'],
  },
  loadingText: {
    fontFamily: 'Paperlogy',
    fontWeight: 600,
    marginTop: 16,
    fontSize: 16,
    color: COLOR_GRAY[400],
  },
});
