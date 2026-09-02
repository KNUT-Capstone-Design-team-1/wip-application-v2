import { StyleSheet } from 'react-native';
import { COLOR, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 특정 알약 복용 알림 카드 헤더 스타일
export const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: px(6),
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(6),
  },
  dayText: {
    color: COLOR.primary,
  },
  titleText: {
    color: COLOR_TEXT.title,
    marginBottom: px(4),
  },
});
