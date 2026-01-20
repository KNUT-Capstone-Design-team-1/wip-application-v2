import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  imageSearchButtonsWrapper: {
    display: 'flex',
    gap: 10,
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    fontSize: 16,
    width: '100%',
    height: 45,
    borderRadius: 10,
  },
  text: {
    fontWeight: 700,
    color: '#fff',
  },
});
