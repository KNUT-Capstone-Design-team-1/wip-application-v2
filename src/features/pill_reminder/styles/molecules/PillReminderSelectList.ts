import { StyleSheet } from 'react-native';
import { COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 알약 선택 모달 목록 스크롤 뷰 스타일
export const styles = StyleSheet.create({
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: px(20),
  },
  emptyContainer: {
    paddingVertical: px(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: COLOR_TEXT.disabled,
  },
});
