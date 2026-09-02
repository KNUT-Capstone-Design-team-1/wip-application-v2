import { StyleSheet } from 'react-native';
import { COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  imageSearchButtonsWrapper: {
    gap: px(14),
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: px(8),
    width: '100%',
    height: px(48),
    borderRadius: px(10),
  },
  text: {
    color: COLOR_TEXT['white'],
  },
  explorerButtonWrapper: {
    paddingHorizontal: px(8),
    marginTop: px(8),
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: px(4),
  },
  explorerInfoText: {
    color: COLOR_TEXT['label'],
  },
  explorerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  explorerButtonText: {
    color: COLOR_TEXT['body'],
  },
});
