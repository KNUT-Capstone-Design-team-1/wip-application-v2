import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE } from '@constants/color';
import { px } from '@utils/responsive';

// 복용 시간 칩 스타일
export const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.primary,
    paddingHorizontal: px(14),
    paddingVertical: px(9),
    borderRadius: px(22),
    borderWidth: 1,
    borderColor: COLOR.primary,
    marginRight: px(8),
    marginBottom: px(8),
  },
  timeText: {
    color: COLOR.white,
    marginRight: px(6),
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: px(40, 32, 44),
    height: px(40, 32, 44),
    borderRadius: px(22),
    backgroundColor: COLOR_BG.base,
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: px(8),
    marginBottom: px(8),
  },
});
