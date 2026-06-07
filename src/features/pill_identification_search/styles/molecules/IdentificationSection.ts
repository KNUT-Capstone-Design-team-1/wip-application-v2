import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';
import { COLOR_GRAY } from '@constants/color';

export const styles = StyleSheet.create({
  identificationSection: {
    width: '100%',
    gap: px(10),
    marginBottom: px(16),
  },
  titleText: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(16),
    fontWeight: 600,
    color: COLOR_GRAY[300],
  },
  childrenContainer: {
    width: '100%',
  },
});
