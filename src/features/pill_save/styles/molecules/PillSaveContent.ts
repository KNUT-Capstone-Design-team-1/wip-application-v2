import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  pillSaveContentWrapper: {
    flex: 1,
    borderRadius: px(10),
    borderColor: COLOR_LINE['border'],
    borderWidth: px(1),
    backgroundColor: COLOR_BG['surface'],
    minHeight: px(190),
    paddingBottom: px(6),
    shadowColor: COLOR['shadow'],
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
