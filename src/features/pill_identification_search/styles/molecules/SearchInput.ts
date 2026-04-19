import { StyleSheet } from 'react-native';
import { COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';

export const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: COLOR_GRAY[250],
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  searchInputDisabled: {
    backgroundColor: COLOR_GRAY[100],
    color: COLOR_GRAY[200],
  },
  searchButton: {
    width: 60,
    height: 44,
    backgroundColor: COLOR_PRIMARY[100],
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonDisabled: {
    backgroundColor: COLOR_GRAY[200],
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
