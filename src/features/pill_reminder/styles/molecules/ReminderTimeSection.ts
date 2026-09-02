import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 복용 시간 섹션 스타일
export const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: COLOR_BG.surface,
    borderRadius: px(14),
    padding: px(16),
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
    shadowColor: COLOR.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: px(12),
  },
  sectionTitle: {
    color: COLOR_TEXT.title,
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});
