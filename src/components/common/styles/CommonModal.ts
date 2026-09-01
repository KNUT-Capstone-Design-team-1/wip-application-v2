import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLOR_BG['overlay'],
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  content: {
    backgroundColor: COLOR_BG['surface'],
    width: '85%',
    maxWidth: px(320),
    borderRadius: px(16),
    paddingTop: px(24),
    paddingBottom: px(16),
    paddingHorizontal: px(24),
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLOR['shadow'],
    shadowOffset: { width: 0, height: px(2) },
    shadowOpacity: 0.25,
    shadowRadius: px(3.84),
  },
  title: {
    color: COLOR_TEXT['title'],
    marginBottom: px(12),
    textAlign: 'center',
  },
  message: {
    color: COLOR_TEXT['body'],
    textAlign: 'center',
    marginBottom: px(24),
    lineHeight: px(20),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: px(12),
  },
  button: {
    flex: 1,
    paddingVertical: px(12),
    borderRadius: px(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: COLOR_BG['btnGray'],
  },
  confirmButton: {
    backgroundColor: COLOR_BG['btnPrimary'],
  },
  destructiveButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLOR['error'],
  },
  destructiveButtonText: {
    color: COLOR['error'],
  },
  cancelButtonText: {
    color: COLOR_TEXT['white'],
  },
  confirmButtonText: {
    color: COLOR_TEXT['white'],
  },
});
