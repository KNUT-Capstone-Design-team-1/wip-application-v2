import { StyleSheet } from 'react-native';
import { COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 알약 요약 목록 및 이동 화살표 영역 스타일
export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: px(8),
    borderTopWidth: 1,
    borderTopColor: COLOR_LINE.border,
  },
  pillsText: {
    color: COLOR_TEXT.label,
    flex: 1,
    marginRight: px(8),
  },
  disabledText: {
    color: COLOR_TEXT.disabled,
  },
});
