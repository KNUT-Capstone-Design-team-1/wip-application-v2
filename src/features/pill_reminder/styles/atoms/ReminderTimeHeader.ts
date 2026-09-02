import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 알림 시간 및 요일 뱃지 스타일
export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bellIcon: {
    marginRight: px(6),
  },
  timeText: {
    color: COLOR_TEXT.title,
    marginRight: px(8),
  },
  dayBadge: {
    backgroundColor: COLOR_BG.base,
    paddingHorizontal: px(8),
    paddingVertical: px(3),
    borderRadius: px(6),
  },
  dayBadgeText: {
    color: COLOR.primary,
  },
  disabledText: {
    color: COLOR_TEXT.disabled,
  },
});
