import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR_BG, COLOR_TEXT } from '@constants/color';
import { screenPadding } from '@constants/size';

export const styles = StyleSheet.create({
  termsContainer: {
    flex: 1,
    backgroundColor: COLOR_BG['surface'],
    paddingTop: screenPadding.top,
    paddingHorizontal: screenPadding.horizontal,
  },
  contentContainer: {
    paddingBottom: px(50), // 하단 여백 추가
  },
  termsText: {
    lineHeight: px(24), // 가독성을 위해 줄 간격 추가
    color: COLOR_TEXT['body'],
  },
});
