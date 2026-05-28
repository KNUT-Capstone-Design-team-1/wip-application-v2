import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '@constants/color';

export const styles = StyleSheet.create({
  identificationSection: {
    width: '100%',
    gap: 10,
    marginBottom: 16,
  },
  titleText: {
    fontFamily: 'Paperlogy',
    fontSize: 16,
    fontWeight: 600,
    color: COLOR_GRAY[300],
  },
  childrenContainer: {
    width: '100%',
  },
});
