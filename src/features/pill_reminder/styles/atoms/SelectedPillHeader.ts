import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 선택한 알약 섹션 상단 헤더 스타일
export const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: px(12),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(6),
  },
  sectionTitle: {
    color: COLOR_TEXT.title,
  },
  folderBadge: {
    backgroundColor: COLOR_BG.base,
    paddingHorizontal: px(8),
    paddingVertical: px(3),
    borderRadius: px(6),
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
  },
  folderBadgeText: {
    color: COLOR_TEXT.subTitle,
  },
  editBtn: {
    padding: px(6),
    borderRadius: px(6),
    backgroundColor: COLOR_BG.base,
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
