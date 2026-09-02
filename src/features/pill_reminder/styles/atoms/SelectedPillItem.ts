import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 선택된 알약 개별 행 아이템 스타일
export const styles = StyleSheet.create({
  selectedPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR_BG.base,
    borderRadius: px(8),
    padding: px(8),
  },
  pillThumb: {
    borderRadius: px(4),
    marginRight: px(10),
  },
  pillThumbPlaceholder: {
    width: px(36),
    height: px(36),
    borderRadius: px(4),
    backgroundColor: COLOR_BG.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: px(10),
  },
  pillInfo: {
    flex: 1,
  },
  pillName: {
    color: COLOR_TEXT.title,
    marginBottom: px(2),
  },
  pillClass: {
    color: COLOR_TEXT.sub,
  },
  removePillBtn: {
    padding: px(6),
  },
});
