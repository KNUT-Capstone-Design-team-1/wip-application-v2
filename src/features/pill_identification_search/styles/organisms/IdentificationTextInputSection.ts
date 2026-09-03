import { COLOR } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

// 식별 검색 텍스트 인풋 섹션 래퍼 스타일
export const styles = StyleSheet.create({
  container: {
    marginBottom: px(2),
    backgroundColor: COLOR['white'],
    paddingHorizontal: px(20),
  },
  textInputColumnWrapper: {
    flexDirection: 'column',
    gap: px(10),
    width: '100%',
  },
  textInputRowWrapper: {
    flexDirection: 'row',
    gap: px(10),
    width: '100%',
  },
});
