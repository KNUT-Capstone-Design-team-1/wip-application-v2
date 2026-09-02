import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_LINE } from '@constants/color';
import { px } from '@utils/responsive';

// 복용 시간 추가 모달 스타일 (태블릿 및 소형기기 대응)
export const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: COLOR_BG.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: px(24),
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLOR_BG.surface,
    borderRadius: px(16),
    padding: px(20),
    maxHeight: px(520),
  },
  pickersContainer: {
    flexDirection: 'row',
    height: px(210),
    marginBottom: px(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnSeparator: {
    width: 1,
    height: px(180),
    backgroundColor: COLOR_LINE.border,
    marginHorizontal: px(4),
    marginTop: px(24),
  },
});
