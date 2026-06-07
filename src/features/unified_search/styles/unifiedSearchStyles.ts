import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '@constants/index';
import { FONT_PAPERLOGY_WEIGHT } from '@constants/font';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: px(20),
    paddingHorizontal: px(16),
    height: px(40),
    borderWidth: px(1),
    borderColor: COLOR_GRAY[200],
    // 그림자 추가 (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: px(1) },
    shadowOpacity: 0.1,
    shadowRadius: px(2),
    // 그림자 추가 (Android)
    elevation: px(2),
  },
  input: {
    flex: 1,
    fontSize: fontPx(14),
    lineHeight: fontPx(18),
    includeFontPadding: false,
    paddingVertical: 0,
    color: '#333',
    ...FONT_PAPERLOGY_WEIGHT['regular'],
  },
  clearButton: {
    paddingVertical: px(5),
  },
});

export const IconStyles = {
  clearIcon: {
    size: fontPx(14),
    color: COLOR_GRAY[300],
    strokeWidth: px(2),
  },
  searchIcon: {
    size: fontPx(14),
    color: COLOR_GRAY[300],
  },
};
