import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_TEXT } from '@constants/color';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLOR_BG.surface,
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  title: {
    marginBottom: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: COLOR_TEXT.disabled,
    paddingVertical: 8,
    marginBottom: 20,
    color: COLOR_TEXT.title,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
  },
  cancelText: {
    color: COLOR_TEXT.sub,
  },
  confirmText: {
    color: COLOR_TEXT.title,
  },
});
