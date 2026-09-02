import { StyleSheet } from 'react-native';
import { COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 복용 알림 목록 헤더 스타일
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
  actionText: {
    color: COLOR_TEXT.sub,
  },
});
