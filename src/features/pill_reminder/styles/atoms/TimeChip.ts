import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE } from '@constants/color';
import { px } from '@utils/responsive';

// 복용 시간 칩 스타일
export const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR_BG.surface,
    paddingHorizontal: px(14),
    paddingVertical: px(8),
    borderRadius: px(20),
    borderWidth: 1.5,
    borderColor: COLOR.primary,
    marginRight: px(8),
    marginBottom: px(8),
  },
  timeText: {
    color: COLOR.primary,
    marginRight: px(6),
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: px(38),
    height: px(38),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR_BG.base,
    borderRadius: px(19),
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLOR_LINE.separator,
    marginRight: px(8),
    marginBottom: px(8),
  },
});
