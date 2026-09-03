import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR, COLOR_LINE } from '@constants/color';

// 식별 검색 하단 액션 버튼 영역 스타일
export const styles = StyleSheet.create({
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: px(20),
    paddingTop: px(12),
    backgroundColor: COLOR['white'],
    borderTopWidth: 1,
    borderTopColor: COLOR_LINE['border'],
  },
});
