import { StyleSheet } from 'react-native';
import { COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';

export const styles = StyleSheet.create({
  inputWrapper: {
    borderColor: COLOR_GRAY[250],
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  input: {
    fontFamily: 'Paperlogy',
    color: COLOR_PRIMARY[400],
    fontSize: 14,
    fontWeight: 500,
    height: '100%',
    includeFontPadding: false,
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
});
