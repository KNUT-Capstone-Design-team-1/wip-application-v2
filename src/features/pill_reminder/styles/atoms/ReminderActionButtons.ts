import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

// 알림 스위치 및 삭제 버튼 영역 스타일
export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(8),
  },
  deleteButton: {
    padding: px(4),
  },
});
