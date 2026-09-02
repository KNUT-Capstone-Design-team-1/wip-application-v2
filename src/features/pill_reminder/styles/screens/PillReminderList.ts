import { StyleSheet } from 'react-native';
import { COLOR_BG } from '@constants/color';
import { px } from '@utils/responsive';

// 복용 알림 목록 화면 메인 스타일
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
    paddingBottom: px(20),
  },
});
