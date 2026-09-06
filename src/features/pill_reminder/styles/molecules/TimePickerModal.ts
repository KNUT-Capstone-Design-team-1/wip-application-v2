import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 복용 시간 스마트 피커 모달 스타일
export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLOR_BG.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: px(16),
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: COLOR_BG.surface,
    borderRadius: px(24),
    padding: px(20),
  },
  sectionLabel: {
    color: COLOR_TEXT.sub,
    marginBottom: px(8),
  },

  // 1. 빠른 식사/시간 프리셋 칩 목록
  presetContainer: {
    flexDirection: 'row',
    gap: px(8),
    marginBottom: px(18),
  },
  presetChip: {
    flex: 1,
    backgroundColor: COLOR_BG.surface,
    borderRadius: px(12),
    paddingVertical: px(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
  },
  presetChipActive: {
    backgroundColor: COLOR.primary,
    borderColor: COLOR.primary,
  },
  presetLabel: {
    color: COLOR_TEXT.title,
    marginBottom: px(2),
  },
  presetLabelActive: {
    color: COLOR.white,
  },
  presetTime: {
    color: COLOR_TEXT.sub,
  },
  presetTimeActive: {
    color: 'rgba(255, 255, 255, 0.9)',
  },

  // 2. 중앙 메인 시간 디스플레이
  displayCard: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginBottom: px(18),
  },
  periodToggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLOR_BG.surface,
    borderRadius: px(10),
    padding: px(3),
    marginBottom: px(12),
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
  },
  periodTab: {
    paddingHorizontal: px(20),
    paddingVertical: px(6),
    borderRadius: px(7),
  },
  periodTabActive: {
    backgroundColor: COLOR.primary,
  },
  periodTabText: {
    color: COLOR_TEXT.sub,
  },
  periodTabTextActive: {
    color: COLOR.white,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: px(12),
  },
  timeBox: {
    backgroundColor: COLOR_BG.surface,
    borderRadius: px(14),
    borderWidth: 1.5,
    borderColor: COLOR_LINE.border,
    paddingHorizontal: px(12),
    paddingVertical: px(6),
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: px(88),
  },
  timeBoxActive: {
    borderColor: COLOR.primary,
  },
  timeInput: {
    fontSize: px(32),
    fontWeight: '700',
    color: COLOR_TEXT.title,
    textAlign: 'center',
    padding: 0,
    minWidth: px(50),
    includeFontPadding: false,
  },
  timeUnit: {
    color: COLOR_TEXT.sub,
    marginTop: px(2),
  },
  colonText: {
    color: COLOR_TEXT.sub,
    marginHorizontal: px(2),
  },

  // 3. 빠른 미세 조절 버튼 (Quick Adjust)
  adjustContainer: {
    flexDirection: 'row',
    gap: px(8),
    marginBottom: px(20),
  },
  adjustBtn: {
    flex: 1,
    backgroundColor: COLOR_BG.surface,
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
    borderRadius: px(12),
    paddingVertical: px(11),
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjustBtnText: {
    color: COLOR_TEXT.title,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
