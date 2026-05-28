import { StyleSheet } from 'react-native';
import { COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';

export const styles = StyleSheet.create({
  gridContainer: {},
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gridItem: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLOR_GRAY[150],
    paddingVertical: 4,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridTitle: {
    fontFamily: 'Paperlogy',
    fontWeight: 600,
    fontSize: 12,
    color: COLOR_PRIMARY[400],
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 12,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 12,
    color: COLOR_GRAY[200],
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontFamily: 'Paperlogy',
    fontWeight: 700,
    fontSize: 16,
    color: COLOR_GRAY[200],
  },
});
