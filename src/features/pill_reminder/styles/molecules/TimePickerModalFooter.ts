import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 시간 선택 모달 하단 푸터 버튼 스타일
export const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: px(12),
    marginTop: px(4),
  },
  cancelBtn: {
    flex: 1,
    height: px(50),
    borderRadius: px(12),
    backgroundColor: COLOR_BG.btnGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: COLOR_TEXT.white,
  },
  confirmBtn: {
    flex: 1,
    height: px(50),
    borderRadius: px(12),
    backgroundColor: COLOR.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    color: COLOR.white,
  },
});
