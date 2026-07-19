import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_TEXT } from '@constants/color';
import { fontPx, px } from '@utils/responsive';

export const styles = StyleSheet.create({
  articleWrapper: {
    backgroundColor: COLOR_BG['surface'],
    marginTop: px(16),
  },
  sectionTitle: {
    marginTop: px(4),
    color: COLOR_TEXT['title'],
  },
  articleTitle: {
    paddingLeft: px(2),
    marginTop: px(16),
    color: COLOR_TEXT['label'],
  },
  paragraphText: {
    paddingLeft: px(4),
    marginTop: px(8),
    lineHeight: fontPx(24),
    color: COLOR_TEXT['body'],
  },
});
