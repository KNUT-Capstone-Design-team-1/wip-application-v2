import { StyleSheet } from 'react-native';
import { COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 알림 목록 카드 상단 타이틀 스타일
export const styles = StyleSheet.create({
  titleRow: {
    marginBottom: px(6),
  },
  titleText: {
    color: COLOR_TEXT.title,
  },
});
