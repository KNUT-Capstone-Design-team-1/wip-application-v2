import { StyleSheet } from 'react-native';
import { COLOR_GRAY, COLOR_PRIMARY } from "@/src/constants";

export const styles = StyleSheet.create({
  inputWrapper: {
    borderColor: COLOR_GRAY[250],
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  input: {
    color: COLOR_PRIMARY[400],
    fontSize: 15,
    fontWeight: 600,
    height: '100%',
  },
});
