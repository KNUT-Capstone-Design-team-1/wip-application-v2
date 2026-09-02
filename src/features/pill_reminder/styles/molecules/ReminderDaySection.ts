import { StyleSheet } from 'react-native';
import { COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 복용 알림 요일 선택 섹션 스타일
export const styles = StyleSheet.create({
  sectionContainer: {
    width: '100%',
  },
  sectionHeader: {
    marginBottom: px(12),
  },
  sectionTitle: {
    color: COLOR_TEXT.title,
  },
});
