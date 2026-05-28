import { StyleSheet } from 'react-native';
import { COLOR, COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';

export const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pageNavButton: {
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: COLOR_GRAY[150],
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    backgroundColor: COLOR['white'],
  },
  pageButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLOR_GRAY[150],
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: COLOR['white'],
  },
  pageButtonActive: {
    backgroundColor: COLOR_PRIMARY[100],
    borderColor: COLOR_PRIMARY[100],
  },
  pageButtonText: {
    fontFamily: 'Paperlogy',
    fontSize: 14,
    color: COLOR_PRIMARY[400],
    fontWeight: 500,
  },
  pageButtonTextActive: {
    fontFamily: 'Paperlogy',
    fontSize: 14,
    fontWeight: 500,
    color: COLOR['white'],
  },
});
