import { StyleSheet } from 'react-native';
import { COLOR, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 지금 열려있는 약국만 보기 체크박스 스타일
export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: px(8),
    paddingHorizontal: px(12),
    borderRadius: px(13),
    elevation: 4,
    shadowColor: COLOR.shadow,
    shadowOffset: { width: 0, height: px(2) },
    shadowOpacity: 0.15,
    shadowRadius: px(4),
  },

  checkboxWrapper: {
    width: px(18),
    height: px(18),
    borderRadius: px(4),
    borderWidth: 1.5,
    borderColor: COLOR.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: px(8),
  },

  checkboxChecked: {
    backgroundColor: COLOR.primary,
  },

  checkboxUnchecked: {
    backgroundColor: 'transparent',
  },

  checkboxCheckmark: {
    color: COLOR.white,
    lineHeight: px(14),
  },

  label: {
    color: COLOR_TEXT.title,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
