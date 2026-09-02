import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 시간/분 직접 숫자 입력 및 디스플레이 박스 스타일
export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR_BG.base,
    borderRadius: px(14),
    paddingVertical: px(12),
    paddingHorizontal: px(20),
    marginBottom: px(16),
    gap: px(14),
  },
  timeBox: {
    width: px(76),
    height: px(54),
    backgroundColor: COLOR_BG.surface,
    borderRadius: px(10),
    borderWidth: 1.5,
    borderColor: COLOR_LINE.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBoxActive: {
    borderColor: COLOR.primary,
    backgroundColor: COLOR_BG.surface,
  },
  timeInput: {
    fontSize: px(28),
    fontWeight: 'bold',
    color: COLOR_TEXT.title,
    textAlign: 'center',
    padding: 0,
    width: '100%',
    height: '100%',
  },
  colonText: {
    fontSize: px(26),
    fontWeight: 'bold',
    color: COLOR_TEXT.sub,
  },
});
