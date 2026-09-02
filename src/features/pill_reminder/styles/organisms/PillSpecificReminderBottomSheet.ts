import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 특정 알약 복용 알림 바텀시트 메인 스타일
export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLOR_BG.overlay,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bottomSheet: {
    backgroundColor: COLOR_BG.surface,
    borderTopLeftRadius: px(24),
    borderTopRightRadius: px(24),
    width: '100%',
    maxWidth: 520,
    height: '75%',
    maxHeight: '85%',
    paddingTop: px(8),
  },
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: px(20),
    paddingTop: px(16),
    paddingBottom: px(16),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: px(60),
    gap: px(12),
  },
  emptyText: {
    color: COLOR_TEXT.sub,
  },
});
