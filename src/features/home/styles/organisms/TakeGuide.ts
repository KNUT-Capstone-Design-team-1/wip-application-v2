import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_TEXT } from '@constants/index';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  guideWrapper: {
    flex: 1,
    width: '100%',
    minHeight: px(57),
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: px(24),
  },
  guideContentWrapper: {
    width: '100%',
    paddingVertical: px(16),
    backgroundColor: COLOR_BG['base'],
    borderRadius: px(13),
  },
  guideTitle: {
    color: COLOR_TEXT['sub'],
    textAlign: 'center',
    lineHeight: fontPx(18),
  },
});
