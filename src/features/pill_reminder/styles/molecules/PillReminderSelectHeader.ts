import { StyleSheet } from 'react-native';
import { COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 알약 선택 모달 헤더 스타일
export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: px(20),
    paddingVertical: px(12),
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LINE.border,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(12),
  },
  title: {
    color: COLOR_TEXT.title,
  },
  selectAllBtn: {
    paddingVertical: px(4),
    paddingHorizontal: px(8),
  },
  selectAllText: {
    color: COLOR_TEXT.sub,
  },
  closeButton: {
    padding: px(4),
  },
});
