import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { fontPx, px } from '@utils/responsive';

// 복용 알림 편집 모드 하단 바 스타일
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
    elevation: 10,
    shadowColor: COLOR.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  countText: {
    color: COLOR_TEXT.title,
    marginBottom: px(8),
    textAlign: 'center',
  },
  buttonRow: {
    width: '100%',
  },
  deleteButton: {
    width: '100%',
    paddingVertical: px(14),
    borderRadius: px(8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLOR.error,
  },
  disabledButton: {
    backgroundColor: COLOR_BG.base,
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
  },
  deleteText: {
    color: COLOR.error,
    fontSize: fontPx(16),
  },
  disabledText: {
    color: COLOR_TEXT.disabled,
    fontSize: fontPx(16),
  },
});
