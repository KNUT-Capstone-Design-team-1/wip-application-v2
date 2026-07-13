import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR_TEXT } from '@constants/color';

export const styles = StyleSheet.create({
  identificationSection: {
    width: '100%',
    gap: px(10),
    marginVertical: px(16),
  },
  titleText: {
    color: COLOR_TEXT['subTitle'],
  },
  childrenContainer: {
    width: '100%',
  },
});
