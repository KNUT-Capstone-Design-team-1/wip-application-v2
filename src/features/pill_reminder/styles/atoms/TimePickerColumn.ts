import { StyleSheet } from 'react-native';
import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const ITEM_HEIGHT = px(40);
export const CONTAINER_HEIGHT = px(180);
export const LIST_PADDING = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;

// 시간 선택기 단일 컬럼 스타일
export const styles = StyleSheet.create({
  column: {
    flex: 1,
    alignItems: 'center',
    height: CONTAINER_HEIGHT + px(30),
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
    left: px(8),
    right: px(8),
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
    color: COLOR_TEXT.sub,
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
