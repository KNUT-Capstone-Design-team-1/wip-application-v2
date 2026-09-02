import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 알림 목록 카드 메모 영역 스타일
export const styles = StyleSheet.create({
  memoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR_BG.base,
    borderRadius: px(6),
    paddingHorizontal: px(10),
    paddingVertical: px(6),
    marginTop: px(8),
  },
  memoText: {
    color: COLOR_TEXT.sub,
    marginLeft: px(6),
    flex: 1,
  },
});
