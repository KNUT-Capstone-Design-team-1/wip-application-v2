import { StyleSheet } from 'react-native';
import { COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 시간 선택 모달 헤더 스타일
export const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: px(18),
    position: 'relative',
  },
  title: {
    color: COLOR_TEXT.title,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    padding: px(4),
  },
});
