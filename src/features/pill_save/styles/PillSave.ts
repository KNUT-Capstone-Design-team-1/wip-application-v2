import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_TEXT } from '@constants/color';
import {
  PILL_SAVE_ROOT_HORIZONTAL_PADDING,
  PILL_SAVE_LOADING_TEXT_MARGIN_TOP,
} from '@features/pill_save/constants/pill_save_constant';

export const styles = StyleSheet.create({
  pillSaveRoot: {
    flex: 1,
    backgroundColor: COLOR_BG['surface'],
    paddingHorizontal: PILL_SAVE_ROOT_HORIZONTAL_PADDING,
  },

  countText: {
    color: COLOR_TEXT['sub'],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR_BG['surface'],
  },
  loadingText: {
    marginTop: PILL_SAVE_LOADING_TEXT_MARGIN_TOP,
    color: COLOR_TEXT['sub'],
  },
  container: { flex: 1 },
});
