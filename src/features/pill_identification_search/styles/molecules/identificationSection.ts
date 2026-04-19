import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '@constants/color';

export const styles = StyleSheet.create({
  identificationSection: {
    width: '100%',
    gap: 10,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLOR_GRAY[300],
    marginBottom: 5,
  },
  childrenContainer: {
    width: '100%',
  },
});
