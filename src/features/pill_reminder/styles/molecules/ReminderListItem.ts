import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE } from '@constants/color';
import { px } from '@utils/responsive';

// 복용 알림 목록 카드 컨테이너 스타일
export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_BG.surface,
    borderRadius: px(12),
    padding: px(16),
    marginBottom: px(12),
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
    shadowColor: COLOR.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledContainer: {
    opacity: 0.6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: px(10),
  },
});
