import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  pillSaveListWrapper: {
    flex: 1,
    width: '100%',
  },
  pillSaveListContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    columnGap: 5,
    rowGap: 10,
    flexWrap: 'wrap',
  },
  pillSaveItemWrapper: {
    width: '49%',
  },
});
