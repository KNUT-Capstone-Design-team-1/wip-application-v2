import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 알약별 복용량 설정 섹션 스타일
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
  dosageList: {
    gap: px(12),
  },
  dosageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: px(4),
  },
  dosagePillName: {
    color: COLOR_TEXT.title,
    flex: 1,
    marginRight: px(12),
  },
});
