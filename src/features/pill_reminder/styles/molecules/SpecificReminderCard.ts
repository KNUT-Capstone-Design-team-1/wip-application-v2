import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_LINE } from '@constants/color';
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
});
