import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '@constants/color';

export const styles = StyleSheet.create({
  pillSearchResultListRoot: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchCountLabel: {
    marginTop: 20,
    fontWeight: 500,
    color: COLOR_GRAY[400],
    fontSize: 12,
  },
});
