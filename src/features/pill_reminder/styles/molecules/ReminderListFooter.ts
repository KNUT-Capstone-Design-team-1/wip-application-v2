import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE } from '@constants/color';
import { px } from '@utils/responsive';

// 복용 알림 목록 하단 추가 버튼 푸터 스타일
export const styles = StyleSheet.create({
  footer: {
    width: '100%',
    maxWidth: 600,
    paddingHorizontal: px(20),
    paddingTop: px(12),
    backgroundColor: COLOR_BG.surface,
    borderTopWidth: 1,
    borderTopColor: COLOR_LINE.border,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.primary,
    height: px(52),
    borderRadius: px(12),
    gap: px(6),
  },
  addButtonText: {
    color: COLOR.white,
  },
});
