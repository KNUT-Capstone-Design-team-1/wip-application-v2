import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_BG.surface,
    borderTopWidth: 1,
    borderTopColor: COLOR_LINE.border,
    paddingHorizontal: px(16),
    paddingTop: px(12),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  countText: {
    color: COLOR_TEXT.title,
    marginBottom: px(8),
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: px(8),
  },
  button: {
    flex: 1,
    paddingVertical: px(12),
    borderRadius: px(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: COLOR_BG.btnGray,
  },
  primaryButton: {
    backgroundColor: COLOR_BG.btnPrimary,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLOR.error,
  },
  disabledButton: {
    backgroundColor: COLOR_BG.btnDisabled,
  },
  cancelText: {
    color: COLOR_TEXT.white,
  },
  primaryText: {
    color: COLOR_TEXT.white,
  },
  deleteText: {
    color: COLOR.error,
  },
  disabledText: {
    color: COLOR_TEXT.disabled,
  },
});
