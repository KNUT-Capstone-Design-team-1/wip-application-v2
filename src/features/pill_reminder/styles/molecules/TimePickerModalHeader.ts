import { StyleSheet } from 'react-native';
import { COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 시간 선택 모달 헤더 스타일
export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: px(16),
  },
  title: {
    color: COLOR_TEXT.title,
  },
  closeButton: {
    padding: px(4),
  },
});
