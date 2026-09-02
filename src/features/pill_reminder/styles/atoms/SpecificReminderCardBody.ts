import { StyleSheet } from 'react-native';
import { COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 특정 알약 복용 알림 카드 바디 스타일
export const styles = StyleSheet.create({
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBodyLeft: {
    flex: 1,
  },
  timeText: {
    color: COLOR_TEXT.title,
    marginBottom: px(2),
  },
  dosageText: {
    color: COLOR_TEXT.label,
  },
});
