import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';
import { COLOR_LINE, COLOR_TEXT } from '@constants/color';

export const styles = StyleSheet.create({
  gridContainer: {},
  itemWrapper: {
    flex: 1,
    paddingHorizontal: px(4),
    marginBottom: px(12),
  },
  gridItem: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: px(8),
    borderWidth: 2,
    borderColor: COLOR_LINE['border'],
    paddingVertical: px(4),
    paddingHorizontal: px(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridTitle: {
    color: COLOR_TEXT['title'],
    textAlign: 'center',
    marginTop: px(4),
    lineHeight: fontPx(12),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: px(60),
  },
  emptyText: {
    color: COLOR_TEXT['sub'],
  },
});
