import { StyleSheet } from 'react-native';
import { COLOR_BG } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  tableWrapper: {
    width: '100%',
    marginTop: px(16),
  },
  tableWebView: {
    flex: 1,
    backgroundColor: COLOR_BG['surface'],
  },
});
