import { StyleSheet } from 'react-native';
import { COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 특정 알약 복용 알림 바텀시트 상단 헤더 스타일
export const styles = StyleSheet.create({
  dragBarContainer: {
    alignItems: 'center',
    paddingVertical: px(6),
  },
  dragBar: {
    width: px(40),
    height: px(4),
    backgroundColor: COLOR_LINE.separator,
    borderRadius: px(2),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: px(20),
    paddingVertical: px(12),
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LINE.border,
  },
  title: {
    color: COLOR_TEXT.title,
    flex: 1,
  },
  closeButton: {
    padding: px(4),
  },
});
