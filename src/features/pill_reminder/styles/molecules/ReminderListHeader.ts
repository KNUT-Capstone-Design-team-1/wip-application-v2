import { StyleSheet } from 'react-native';
import { COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 복용 알림 목록 헤더 스타일 (알약 보관함 헤더 디자인과 일치)
export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: px(12),
    paddingHorizontal: px(20),
    width: '100%',
    maxWidth: 600,
  },
  countText: {
    color: COLOR_TEXT.title,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(14),
  },
  actionText: {
    color: COLOR_TEXT.sub,
  },
});
