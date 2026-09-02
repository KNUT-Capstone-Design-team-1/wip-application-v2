import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 요일 간편 프리셋 칩 스타일
export const styles = StyleSheet.create({
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: px(8),
  },
  quickChip: {
    paddingHorizontal: px(12),
    paddingVertical: px(6),
    borderRadius: px(16),
    backgroundColor: COLOR_BG.base,
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
  },
  quickChipSelected: {
    backgroundColor: COLOR.primary,
    borderColor: COLOR.primary,
  },
  quickText: {
    color: COLOR_TEXT.sub,
  },
  quickTextSelected: {
    color: COLOR.white,
  },
});
