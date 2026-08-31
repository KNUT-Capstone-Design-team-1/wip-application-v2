import { StyleSheet } from 'react-native';
import { COLOR } from '@constants/color';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: COLOR.primary,
  },
  unselected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#C4C4C4',
  },
});
