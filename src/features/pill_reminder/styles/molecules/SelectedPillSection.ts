import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 선택된 알약 섹션 카드 스타일
export const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: COLOR_BG.surface,
    borderRadius: px(14),
    padding: px(16),
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
    shadowColor: COLOR_TEXT.title,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  selectedPillsList: {
    gap: px(8),
  },
  addPillCenterBtn: {
    paddingVertical: px(18),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR_BG.base,
    borderRadius: px(12),
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLOR_LINE.separator,
    gap: px(6),
  },
  addPillCenterText: {
    color: COLOR_TEXT.subTitle,
  },
});
