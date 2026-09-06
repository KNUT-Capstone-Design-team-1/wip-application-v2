import { StyleSheet } from 'react-native';
import { COLOR_BG } from '@constants/color';
import { px } from '@utils/responsive';

// 다른 알약 선택 모달 메인 오거나이즘 스타일
export const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: COLOR_BG.surface,
    borderTopLeftRadius: px(24),
    borderTopRightRadius: px(24),
    width: '100%',
    maxWidth: 520,
    height: '85%',
    maxHeight: '90%',
    alignSelf: 'center',
  },
  contentContainer: {
    flex: 1,
  },
});
