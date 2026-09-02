import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 알약 선택 목록의 개별 항목 스타일 (알약 보관함 컨벤션 일치)
export const styles = StyleSheet.create({
  pillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: px(14),
    paddingHorizontal: px(20),
    backgroundColor: COLOR_BG.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LINE.border,
  },
  pillItemSelected: {
    backgroundColor: COLOR_BG.base,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: px(12),
  },
  pillThumb: {
    borderRadius: px(8),
    marginRight: px(12),
    backgroundColor: COLOR_BG.base,
  },
  pillThumbPlaceholder: {
    width: px(44),
    height: px(44),
    borderRadius: px(8),
    backgroundColor: COLOR_BG.base,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: px(12),
  },
  pillInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  pillName: {
    color: COLOR_TEXT.title,
    marginBottom: px(2),
  },
  pillClass: {
    color: COLOR_TEXT.sub,
  },
});
