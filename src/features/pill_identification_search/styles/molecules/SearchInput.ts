import { StyleSheet } from 'react-native';
import { COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';

export const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderRadius: 20,
    paddingLeft: 16,
    gap: 4,
  },
  searchContainerDisabled: {
    backgroundColor: COLOR_GRAY[100],
    color: COLOR_GRAY[200],
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontFamily: 'Paperlogy',
    fontWeight: 600,
    fontSize: 14,
  },
  searchButton: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
