import { StyleSheet } from 'react-native';
import { COLOR_PRIMARY } from '../../../../constants/color';

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
  searchTagList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
