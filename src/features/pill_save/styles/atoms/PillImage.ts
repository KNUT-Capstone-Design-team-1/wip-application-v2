import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_LINE } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  imageContainer: {
    backgroundColor: COLOR_BG['base'],
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pillImage: {
    width: '100%',
    height: px(82),
    borderWidth: px(1),
    borderColor: COLOR_LINE['border'],
    marginBottom: px(4),
  },
});
