import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { screenPadding } from '@constants/size';

export const styles = StyleSheet.create({
  scrollViewWrapper: {
    flex: 1,
    backgroundColor: COLOR_BG['surface'],
  },
  viewWrapper: {
    backgroundColor: COLOR_BG['base'],
    flex: 1,
    overflow: 'hidden',
  },
  pillImgContainer: {
    paddingTop: screenPadding.top,
    paddingHorizontal: screenPadding.horizontal,
    paddingBottom: px(16),
    backgroundColor: COLOR_BG['surface'],
  },
  pillImgWrapper: {
    aspectRatio: 1299 / 709,
    borderRadius: px(18),
    overflow: 'hidden',
    width: '100%',
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
    marginBottom: px(40),
    marginHorizontal: screenPadding.horizontal,
    paddingVertical: px(12),
    paddingHorizontal: px(16),
    backgroundColor: COLOR_BG['surface'],
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
