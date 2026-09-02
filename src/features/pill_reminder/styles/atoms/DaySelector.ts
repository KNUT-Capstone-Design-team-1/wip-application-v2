import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 요일 선택 컴포넌트 스타일
export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: px(12),
  },
  dayButton: {
    width: px(40, 32, 44),
    height: px(40, 32, 44),
    borderRadius: px(22),
    backgroundColor: COLOR_BG.base,
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: COLOR.primary,
    borderColor: COLOR.primary,
  },
  dayText: {
    color: COLOR_TEXT.sub,
  },
  dayTextSelected: {
    color: COLOR.white,
  },
});
