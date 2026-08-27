import { StyleSheet } from 'react-native';
import { COLOR } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  saveBtn: {
    backgroundColor: COLOR['primary'],
    height: px(52),
    borderRadius: px(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: COLOR['white'],
  },
});
