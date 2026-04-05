import { StyleSheet } from 'react-native';
import { COLOR_PRIMARY } from '../../../../constants/color';

export const styles = StyleSheet.create({
  searchBarWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 40,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: COLOR_PRIMARY[400],
  },
  searchTextInput: {
    flex: 1,
  },
  clearButton: {
    position: 'absolute',
    width: 20,
    right: '15%',
    justifyContent: 'center',
    // alignItems: 'center',
    // marginRight: 8,
  },
  clearButtonText: {
    fontSize: 20,
    color: '#999',
    fontWeight: 'bold',
  },
  searchButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
