import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 재고 문의 요약 모달 스타일
export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLOR_BG.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: px(20),
  },
  modalCard: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: COLOR_BG.surface,
    borderRadius: px(16),
    paddingTop: px(18),
    paddingBottom: px(16),
    paddingHorizontal: px(18),
    shadowColor: COLOR.shadow,
    shadowOffset: { width: 0, height: px(4) },
    shadowOpacity: 0.25,
    shadowRadius: px(8),
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: px(12),
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LINE.border,
  },
  headerTitle: {
    color: COLOR_TEXT.title,
  },
  scrollContent: {
    paddingVertical: px(12),
    gap: px(14),
  },
  sectionContainer: {
    gap: px(4),
  },
  sectionLabel: {
    color: COLOR_TEXT.subTitle,
  },
  pharmacyName: {
    color: COLOR_TEXT.title,
  },
  pharmacySub: {
    color: COLOR_TEXT.body,
  },
  pillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR_BG.base,
    borderRadius: px(10),
    padding: px(10),
    gap: px(10),
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
  },
  pillImage: {
    width: px(44),
    height: px(44),
    borderRadius: px(6),
    backgroundColor: COLOR_BG.surface,
  },
  pillInfo: {
    flex: 1,
    gap: px(2),
  },
  pillName: {
    color: COLOR_TEXT.title,
  },
  pillMeta: {
    color: COLOR_TEXT.subTitle,
  },
  scriptContainer: {
    gap: px(6),
  },
  scriptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(3),
    paddingHorizontal: px(6),
    paddingVertical: px(2),
  },
  copyBtnText: {
    color: COLOR.primary,
  },
  scriptBox: {
    backgroundColor: COLOR_BG.base,
    borderRadius: px(10),
    padding: px(12),
    borderLeftWidth: px(4),
    borderLeftColor: COLOR.primary,
  },
  scriptText: {
    color: COLOR_TEXT.title,
    lineHeight: px(20),
  },
  footer: {
    paddingTop: px(8),
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: px(8),
    backgroundColor: COLOR.primary,
    paddingVertical: px(12),
    borderRadius: px(10),
  },
  callButtonDisabled: {
    backgroundColor: COLOR_BG.btnDisabled,
  },
  callButtonText: {
    color: COLOR_TEXT.white,
  },
});
