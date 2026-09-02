import { StyleSheet } from 'react-native';
import { COLOR, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: px(6),
    marginTop: px(6),
    paddingVertical: px(10),
    borderRadius: px(8),
    backgroundColor: COLOR['primary'],
  },
  text: {
    color: COLOR_TEXT['white'],
  },
});
