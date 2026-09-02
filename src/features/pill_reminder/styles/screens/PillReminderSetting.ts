import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 복용 알림 설정 화면 전체 레이아웃 스타일
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_BG.surface,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR_BG.surface,
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
  },
  scrollContent: {
    paddingHorizontal: px(20),
    paddingTop: 0,
    paddingBottom: px(32),
    gap: px(28),
  },
  sectionContainer: {
    width: '100%',
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
