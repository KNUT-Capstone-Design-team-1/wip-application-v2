import { px } from '@utils/responsive';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flexDirection: 'column', gap: px(8) },
  image: {
    width: px(200),
    height: px(200),
    borderRadius: px(8),
    alignSelf: 'center',
  },
  text: { lineHeight: px(22) },
});
