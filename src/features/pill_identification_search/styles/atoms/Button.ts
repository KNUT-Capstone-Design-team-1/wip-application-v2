import { StyleSheet } from 'react-native';
import { COLOR_PRIMARY } from '@constants/color';

export const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 14,
    borderColor: COLOR_PRIMARY[100],
    borderWidth: 1,
  },
  label: {
    fontFamily: 'Paperlogy',
    fontSize: 18,
    fontWeight: 700,
  },
});
