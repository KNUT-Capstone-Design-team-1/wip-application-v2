import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_LINE } from '@constants/color';
import { px } from '@utils/responsive';
import { CONTAINER_HEIGHT } from '@features/pill_reminder/styles/atoms/TimePickerColumn';

// 복용 시간 추가 모달 스타일
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
    paddingHorizontal: px(12),
  },
  modalContent: {
    width: '96%',
    maxWidth: 520,
    backgroundColor: COLOR_BG.surface,
    borderRadius: px(20),
    padding: px(24),
    maxHeight: px(560),
  },
  pickersContainer: {
    flexDirection: 'row',
    height: CONTAINER_HEIGHT,
    marginBottom: px(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnSeparator: {
    width: 1,
    height: CONTAINER_HEIGHT - px(16),
    backgroundColor: COLOR_LINE.border,
    marginHorizontal: px(10),
    marginTop: px(24),
  },
});
