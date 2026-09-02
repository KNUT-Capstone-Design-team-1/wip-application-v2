import { StyleSheet } from 'react-native';
import { COLOR } from '@constants/color';
import { px } from '@utils/responsive';

// 모달 내부 토스트 스타일 (프로젝트 공통 토스트 규격 일치)
export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: px(40),
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: px(20),
    paddingVertical: px(12),
    borderRadius: px(8),
    maxWidth: '85%',
  },
  text: {
    color: COLOR.white,
    textAlign: 'center',
    lineHeight: px(20),
  },
});
