import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  scrollViewWrapper: {
    backgroundColor: COLOR_BG['surface'],
    flex: 1,
  },
  viewWrapper: {
    backgroundColor: COLOR_BG['surface'],
    flex: 1,
    overflow: 'hidden',
    paddingHorizontal: px(16),
  },
  pillImgWrapper: {
    aspectRatio: 1299 / 709,
    borderRadius: px(18),
    marginTop: px(16),
    overflow: 'hidden',
    width: '100%',
    backgroundColor: COLOR_BG['surface'],
  },
  pillImg: {
    height: '100%',
    width: '100%',
  },
  pillDetailNoImageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR_BG['base'],
  },
  pillDetailNoImageText: {
    color: COLOR_TEXT['disabled'],
    paddingHorizontal: px(16),
    paddingVertical: px(16),
  },
  pillResultDetailRoot: {
    flex: 1,
    backgroundColor: COLOR_BG['surface'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillResultDetailNotFoundText: {
    color: COLOR_TEXT['sub'],
    paddingHorizontal: px(16),
    paddingVertical: px(16),
  },
  disclaimerWrapper: {
    marginTop: px(24),
    marginBottom: px(40),
    padding: px(16),
    backgroundColor: COLOR_BG['base'],
    borderRadius: px(8),
    borderWidth: 1,
    borderColor: COLOR_LINE['border'],
  },
  disclaimerText: {
    color: COLOR_TEXT['label'],
    lineHeight: px(20),
    textAlign: 'center',
  },
});
