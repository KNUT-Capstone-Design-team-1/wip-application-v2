import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 복용량 증감 컴포넌트 스타일
export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR_BG.base,
    borderRadius: px(20),
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
    paddingHorizontal: px(4),
    paddingVertical: px(2),
  },
  button: {
    width: px(28),
    height: px(28),
    borderRadius: px(14),
    backgroundColor: COLOR_BG.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'transparent',
  },
  valueContainer: {
    minWidth: px(36),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: px(6),
  },
  valueText: {
    color: COLOR_TEXT.title,
  },
});
