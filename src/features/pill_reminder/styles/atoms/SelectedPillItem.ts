import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

// 선택된 알약 개별 행 아이템 스타일
export const styles = StyleSheet.create({
  selectedPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: px(10),
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LINE.border,
  },
  pillThumb: {
    width: px(36),
    height: px(36),
    borderRadius: px(6),
    marginRight: px(10),
  },
  pillThumbPlaceholder: {
    width: px(36),
    height: px(36),
    borderRadius: px(6),
    backgroundColor: COLOR_BG.base,
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
