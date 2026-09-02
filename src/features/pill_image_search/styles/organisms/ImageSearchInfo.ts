import { COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_BG['base'],
    borderRadius: px(12),
    padding: px(14),
    gap: px(8),
    marginBottom: px(12),
  },
  infoText: {
    color: COLOR_TEXT['body'],
  },
  identificationSearchLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  identificationSearchLinkText: {
    color: COLOR_TEXT['body'],
  },
});
