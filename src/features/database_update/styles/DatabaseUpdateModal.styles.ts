import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLOR_BG['overlay'],
    justifyContent: 'center',
    alignItems: 'center',
    padding: px(20),
  },
  modalContainer: {
    width: '85%',
    maxWidth: px(320),
    backgroundColor: COLOR_BG['surface'],
    borderRadius: px(16),
    paddingHorizontal: px(14),
    paddingVertical: px(14),
    alignItems: 'center',
  },
  title: {
    marginBottom: px(4),
    color: COLOR_TEXT['title'],
  },
  subTitle: {
    marginBottom: px(8),
    color: COLOR_TEXT['sub'],
    textAlign: 'center',
  },
  description: {
    marginBottom: px(16),
    color: COLOR_TEXT['body'],
    textAlign: 'center',
  },

  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: px(8),
  },
  cancelButton: {
    flex: 1,
    paddingVertical: px(12),
    backgroundColor: COLOR_BG['surface'],
    borderColor: COLOR['primary'],
    borderWidth: 1,
    borderRadius: px(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: COLOR['primary'],
  },
  confirmButton: {
    flex: 1,
    paddingVertical: px(12),
    backgroundColor: COLOR['primary'],
    borderColor: COLOR['primary'],
    borderWidth: 1,
    borderRadius: px(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: COLOR_TEXT['white'],
  },
});
