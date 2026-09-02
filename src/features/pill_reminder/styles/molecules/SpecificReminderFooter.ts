import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 특정 알약 복용 알림 바텀시트 하단 푸터 스타일
export const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: px(20),
    paddingTop: px(12),
    borderTopWidth: 1,
    borderTopColor: COLOR_LINE.border,
    backgroundColor: COLOR_BG.surface,
    gap: px(8),
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.primary,
    height: px(52),
    borderRadius: px(12),
    gap: px(6),
  },
  addBtnText: {
    color: COLOR.white,
  },
  closeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR_BG.btnGray,
    height: px(52),
    borderRadius: px(12),
  },
  closeBtnText: {
    color: COLOR_TEXT.white,
  },
});
