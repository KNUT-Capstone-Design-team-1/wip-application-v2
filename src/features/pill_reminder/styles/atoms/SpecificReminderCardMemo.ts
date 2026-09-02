import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 특정 알약 복용 알림 카드 메모 스타일
export const styles = StyleSheet.create({
  memoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR_BG.surface,
    borderRadius: px(6),
    paddingHorizontal: px(8),
    paddingVertical: px(4),
    marginTop: px(8),
  },
  memoText: {
    color: COLOR_TEXT.sub,
    marginLeft: px(6),
    flex: 1,
  },
});
