import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_LINE } from '@constants/color';
import { px } from '@utils/responsive';

// 다른 알약 선택 모달 메인 오거나이즘 스타일
export const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: COLOR_BG.overlay,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bottomSheet: {
    backgroundColor: COLOR_BG.surface,
    borderTopLeftRadius: px(24),
    borderTopRightRadius: px(24),
    width: '100%',
    maxWidth: 520,
    height: '85%',
    maxHeight: '90%',
    paddingTop: px(8),
  },
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
});
