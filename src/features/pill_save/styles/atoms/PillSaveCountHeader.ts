import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR_TEXT } from '@constants/color';

export const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: px(12) },
  title: { color: COLOR_TEXT.title },
});
