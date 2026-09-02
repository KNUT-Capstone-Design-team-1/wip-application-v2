import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { fontPx, px } from '@utils/responsive';

// 복용 알림 편집 모드 하단 바 스타일 (알약 보관함 바텀 바 디자인과 일치)
export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLOR_BG.surface,
    borderTopWidth: 1,
    borderTopColor: COLOR_LINE.border,
    paddingHorizontal: px(20),
    paddingTop: px(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLOR.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  countText: {
    color: COLOR_TEXT.title,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLOR.error,
    paddingHorizontal: px(20),
    paddingVertical: px(10),
    borderRadius: px(8),
  },
  disabledButton: {
    backgroundColor: COLOR_BG.base,
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
  },
  deleteText: {
    color: COLOR.error,
    fontSize: fontPx(14),
  },
  disabledText: {
    color: COLOR_TEXT.sub,
    fontSize: fontPx(14),
  },
});
