import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const ITEM_HEIGHT = Math.round(px(44, 38, 48));
export const VISIBLE_ITEMS = 5; // 5개 항목 노출 (위 2개, 중앙 1개, 아래 2개)
export const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
export const LIST_PADDING = ITEM_HEIGHT * 2; // 중앙 1개에 정확히 맞추기 위한 상하 여백

// 시간 선택기 단일 컬럼 스타일
export const styles = StyleSheet.create({
  column: {
    flex: 1,
    alignItems: 'center',
    height: CONTAINER_HEIGHT + px(28),
  },
  columnLabel: {
    color: COLOR_TEXT.subTitle,
    marginBottom: px(8),
  },
  pickerWrapper: {
    width: '100%',
    height: CONTAINER_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
  },
  selectionIndicator: {
    position: 'absolute',
    top: LIST_PADDING,
    left: px(4),
    right: px(4),
    height: ITEM_HEIGHT,
    backgroundColor: COLOR_BG.base,
    borderRadius: px(8),
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
    zIndex: 0,
  },
  listContainer: {
    width: '100%',
    height: CONTAINER_HEIGHT,
    zIndex: 1,
  },
  listContent: {
    paddingVertical: LIST_PADDING,
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerText: {
    color: COLOR_TEXT.disabled,
  },
  pickerTextSelected: {
    color: COLOR_TEXT.title,
  },
  columnSeparator: {
    width: 1,
    height: CONTAINER_HEIGHT,
    backgroundColor: COLOR_LINE.border,
    marginHorizontal: px(4),
    marginTop: px(28),
  },
});
