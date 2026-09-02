import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 알약 선택 모달 하단 푸터 액션 버튼 스타일
export const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    paddingHorizontal: px(20),
    paddingTop: px(12),
    borderTopWidth: 1,
    borderTopColor: COLOR_LINE.border,
    backgroundColor: COLOR_BG.surface,
    gap: px(10),
  },
  cancelBtn: {
    flex: 1,
    height: px(52),
    borderRadius: px(12),
    backgroundColor: COLOR_BG.btnGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: COLOR_TEXT.white,
  },
  confirmBtn: {
    flex: 2,
    height: px(52),
    borderRadius: px(12),
    backgroundColor: COLOR.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBtn: {
    backgroundColor: COLOR_BG.btnDisabled,
  },
  confirmText: {
    color: COLOR.white,
  },
  disabledText: {
    color: COLOR_TEXT.disabled,
  },
});
