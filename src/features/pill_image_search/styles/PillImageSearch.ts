import { COLOR_BG, COLOR_LINE } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { bottomTabSize } from '@constants/size';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_BG['surface'],
    paddingHorizontal: px(20),
    paddingBottom: px(40) + bottomTabSize.height,
  },
  contentContainer: {},
  hr: {
    width: '100%',
    height: px(2),
    backgroundColor: COLOR_LINE['separator'],
    marginTop: px(30),
    marginBottom: px(30),
  },
});
