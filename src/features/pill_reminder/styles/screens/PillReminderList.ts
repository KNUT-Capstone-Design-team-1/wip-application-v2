import { StyleSheet } from 'react-native';
import { COLOR_BG } from '@constants/color';
import { px } from '@utils/responsive';

// 복용 알림 목록 화면 메인 스타일
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
    paddingBottom: px(20),
  },
});
