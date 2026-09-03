import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR_TEXT } from '@constants/color';

// 마크 모달 상단 헤더 스타일
export const styles = StyleSheet.create({
  grabber: {
    width: px(40),
    height: px(4),
    backgroundColor: '#E0E0E0',
    borderRadius: px(2),
    alignSelf: 'center',
    marginBottom: px(16),
  },
  closeButton: {
    position: 'absolute',
    top: px(16),
    right: px(16),
    padding: px(6),
    zIndex: 10,
  },
  title: {
    textAlign: 'center',
    color: COLOR_TEXT['title'],
    marginBottom: px(16),
  },
});
