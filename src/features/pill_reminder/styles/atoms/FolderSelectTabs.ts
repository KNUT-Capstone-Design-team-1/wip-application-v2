import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 폴더 선택 탭 가로 스크롤 바 스타일
export const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LINE.border,
    backgroundColor: COLOR_BG.surface,
  },
  scrollContent: {
    paddingHorizontal: px(20),
    paddingVertical: px(10),
    gap: px(8),
    alignItems: 'center',
  },
  tabChip: {
    paddingHorizontal: px(14),
    paddingVertical: px(6),
    borderRadius: px(16),
    backgroundColor: COLOR_BG.base,
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
  },
  tabChipActive: {
    backgroundColor: COLOR.primary,
    borderColor: COLOR.primary,
  },
  tabText: {
    color: COLOR_TEXT.sub,
  },
  tabTextActive: {
    color: COLOR.white,
  },
});
