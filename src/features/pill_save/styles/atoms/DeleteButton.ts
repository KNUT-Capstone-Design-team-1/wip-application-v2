import { StyleSheet } from 'react-native';
import { COLOR_BG } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: px(4),
    right: px(4),
    backgroundColor: COLOR_BG['btnGray'],
    padding: px(4),
    borderRadius: px(50),
  },
});
