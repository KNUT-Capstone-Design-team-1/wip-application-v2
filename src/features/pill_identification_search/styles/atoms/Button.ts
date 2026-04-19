import { StyleSheet } from 'react-native';
import { COLOR_PRIMARY } from '@constants/color';

export const styles = StyleSheet.create({
  button: {
    display: 'flex',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    borderColor: COLOR_PRIMARY[100],
    borderWidth: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: 600,
  },
});
