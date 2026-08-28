import { StyleSheet } from 'react-native';
import { COLOR_BG } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLOR_BG['overlay'],
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: COLOR_BG['surface'],
    borderTopLeftRadius: px(20),
    borderTopRightRadius: px(20),
    paddingBottom: px(20),
    maxHeight: '80%',
  },
  list: {
    maxHeight: px(300),
    marginBottom: px(16),
  },
});
