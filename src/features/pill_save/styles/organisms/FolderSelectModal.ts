import { StyleSheet } from 'react-native';
import { COLOR_BG } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: COLOR_BG['surface'],
    borderTopLeftRadius: px(24),
    borderTopRightRadius: px(24),
    height: '65%', // 고정 높이
  },
  contentContainer: {
    flex: 1, // 남은 공간 모두 차지
  },
  list: {
    flex: 1, // 스크롤 가능 영역 확장
  },
  footerContainer: {
    paddingHorizontal: px(20),
    paddingTop: px(16),
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});
