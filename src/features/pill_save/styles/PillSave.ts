import { StyleSheet } from 'react-native';
import { COLOR, COLOR_GRAY } from '@constants/color';

export const styles = StyleSheet.create({
  pillSaveRoot: {
    flex: 1,
    backgroundColor: COLOR['white'],
    paddingHorizontal: 8,
  },
  header: {
    paddingVertical: 12,
    marginHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_GRAY[100],
  },
  countText: {
    fontFamily: 'Paperlogy',
    fontSize: 14,
    color: COLOR_GRAY[400],
    fontWeight: 600,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR['white'],
  },
  loadingText: {
    fontFamily: 'Paperlogy',
    marginTop: 12,
    fontSize: 16,
    fontWeight: 700,
    color: COLOR_GRAY[400],
  },
});
