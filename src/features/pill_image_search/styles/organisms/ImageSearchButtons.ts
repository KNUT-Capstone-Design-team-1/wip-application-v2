import { StyleSheet } from 'react-native';
import { COLOR, COLOR_GRAY } from '@constants/color';

export const styles = StyleSheet.create({
  imageSearchButtonsWrapper: {
    display: 'flex',
    gap: 12,
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    height: 45,
    borderRadius: 10,
  },
  text: {
    fontFamily: 'Paperlogy',
    fontSize: 16,
    fontWeight: 700,
    color: COLOR['white'],
  },
  searchButton: {
    marginTop: 20,
    width: '100%',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontFamily: 'Paperlogy',
    fontSize: 18,
    fontWeight: 700,
    color: COLOR['white'],
  },
  hr: {
    width: '100%',
    height: 1,
    backgroundColor: COLOR_GRAY[100],
    marginVertical: 24,
  },
});
