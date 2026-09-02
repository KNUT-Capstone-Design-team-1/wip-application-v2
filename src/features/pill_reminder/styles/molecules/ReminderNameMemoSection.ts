import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { fontPx, px } from '@utils/responsive';

// 복용 알림 이름 및 메모 입력 섹션 스타일
export const styles = StyleSheet.create({
  sectionContainer: {
    width: '100%',
  },
  sectionHeader: {
    marginBottom: px(12),
  },
  sectionTitle: {
    color: COLOR_TEXT.title,
  },
  inputGroup: {
    marginBottom: px(14),
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: px(6),
  },
  label: {
    color: COLOR_TEXT.title,
  },
  counterText: {
    color: COLOR_TEXT.sub,
  },
  textInput: {
    backgroundColor: COLOR_BG.base,
    borderRadius: px(8),
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
    paddingHorizontal: px(14),
    paddingVertical: px(10),
    color: COLOR_TEXT.title,
    fontSize: fontPx(13.5),
  },
  memoInput: {
    backgroundColor: COLOR_BG.base,
    borderRadius: px(8),
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
    paddingHorizontal: px(14),
    paddingVertical: px(10),
    color: COLOR_TEXT.title,
    fontSize: fontPx(13.5),
    minHeight: px(76),
    textAlignVertical: 'top',
  },
});
