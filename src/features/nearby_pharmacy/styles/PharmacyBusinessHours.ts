import { StyleSheet } from 'react-native';
import { COLOR, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 약국 영업시간 펼침 목록 및 요일별 행 스타일
export const pharmacyBusinessHoursStyles = StyleSheet.create({
  hoursListContainer: {
    backgroundColor: 'transparent',
    marginTop: px(4),
    paddingHorizontal: px(2),
    gap: px(4),
  },

  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: px(2),
  },

  hoursDayLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(6),
  },

  hoursDayLabel: {
    color: COLOR_TEXT.body,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  hoursDayLabelToday: {
    color: COLOR_TEXT.subTitle,
  },

  hoursTodayBadge: {
    backgroundColor: COLOR.secondary,
    paddingHorizontal: px(5),
    paddingVertical: px(1),
    borderRadius: px(4),
  },

  hoursTodayBadgeText: {
    color: COLOR.white,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  hoursTimeText: {
    color: COLOR_TEXT.body,
    includeFontPadding: false,
    textAlignVertical: 'center',
    textAlign: 'right',
    flex: 1,
  },

  hoursTimeTextToday: {
    color: COLOR_TEXT.subTitle,
  },

  sourceContainer: {
    marginTop: px(4),
    alignItems: 'flex-end',
  },

  sourceText: {
    color: COLOR_TEXT.sub,
  },
});
