import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR, COLOR_TEXT } from '@constants/color';

// 마크 모달 내부 콘텐츠(리스트/로딩/빈화면/에러) 스타일
export const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: '#fee',
    padding: px(10),
    borderRadius: px(6),
    marginBottom: px(10),
  },
  errorText: {
    color: COLOR['error'],
    textAlign: 'center',
  },
  markListContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: px(10),
    color: COLOR_TEXT['sub'],
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: px(60),
  },
  emptyText: {
    color: COLOR_TEXT['sub'],
    textAlign: 'center',
  },
});
