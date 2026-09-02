import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 복용 알림 설정 화면 하단 저장 버튼 바 스타일
export const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: COLOR_BG.surface,
    paddingHorizontal: px(20),
    paddingTop: px(12),
    borderTopWidth: 1,
    borderTopColor: COLOR_LINE.border,
    width: '100%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: COLOR.primary,
    height: px(52),
    borderRadius: px(12),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 600,
  },
  disabledButton: {
    backgroundColor: COLOR_BG.btnDisabled,
  },
  saveText: {
    color: COLOR.white,
  },
  disabledText: {
    color: COLOR_TEXT.disabled,
  },
});
