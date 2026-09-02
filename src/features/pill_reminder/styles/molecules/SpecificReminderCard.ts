import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 특정 알약 복용 알림 카드 스타일
export const styles = StyleSheet.create({
  reminderCard: {
    backgroundColor: COLOR_BG.base,
    borderRadius: px(12),
    padding: px(16),
    marginBottom: px(12),
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
  },
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
