import { StyleSheet } from 'react-native';
import { COLOR_GRAY, COLOR_PRIMARY } from '@/src/constants';

export const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  pageNavButton: {
    borderWidth: 1,
    borderColor: COLOR_GRAY[200],
    fontSize: 15,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginHorizontal: 5,
    backgroundColor: COLOR_GRAY[100],
  },
  pageNavText: {
    color: '#333',
    fontWeight: '600',
  },
  pageButton: {
    borderWidth: 1,
    borderColor: COLOR_GRAY[150],
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 3,
    backgroundColor: '#fff',
  },
  pageButtonActive: {
    backgroundColor: COLOR_PRIMARY[100],
    borderColor: COLOR_PRIMARY[100],
  },
  pageButtonText: {
    color: COLOR_GRAY[300],
    fontWeight: '600',
  },
  pageButtonTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
});
