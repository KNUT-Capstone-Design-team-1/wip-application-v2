import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_LINE } from '@constants/index';
import { px } from '@utils/responsive';
import { bottomTabSize, screenPadding } from '@constants/size';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_BG['surface'],
    paddingTop: screenPadding.top,
    paddingHorizontal: px(20),
    paddingBottom: bottomTabSize.height,
  },
  hr: {
    width: '100%',
    height: px(2),
    backgroundColor: COLOR_LINE['border'],
    marginTop: px(12),
  },
});
