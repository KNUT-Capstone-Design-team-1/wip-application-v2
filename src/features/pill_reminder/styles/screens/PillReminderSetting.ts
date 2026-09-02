import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 복용 알림 설정 화면 전체 레이아웃 스타일
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_BG.base,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
  },
  scrollContent: {
    paddingHorizontal: px(20),
    paddingTop: px(16),
    paddingBottom: px(24),
    gap: px(16),
  },
  sectionCard: {
    backgroundColor: COLOR_BG.surface,
    borderRadius: px(14),
    padding: px(16),
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
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
});
