import { StyleSheet } from 'react-native';
import { COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 특정 알약 복용 알림 빈 화면 스타일
export const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: px(40),
  },
  emptyText: {
    color: COLOR_TEXT.sub,
    marginTop: px(12),
  },
});
