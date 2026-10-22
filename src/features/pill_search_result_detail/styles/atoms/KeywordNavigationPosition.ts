import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  label: {
    minWidth: px(44),
    paddingHorizontal: px(8),
    paddingVertical: px(4),
    borderRadius: px(12),
    overflow: 'hidden',
    backgroundColor: COLOR_BG.surface,
    color: COLOR_TEXT.body,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
});
