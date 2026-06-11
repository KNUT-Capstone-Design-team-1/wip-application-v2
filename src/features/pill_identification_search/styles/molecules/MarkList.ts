import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';
import { COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';

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
    borderColor: COLOR_GRAY[150],
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
    fontFamily: 'Paperlogy',
    fontWeight: 600,
    fontSize: fontPx(12),
    color: COLOR_PRIMARY[400],
    textAlign: 'center',
    marginTop: px(4),
    lineHeight: fontPx(12),
  },
  footerLoader: {
    paddingVertical: px(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: fontPx(12),
    color: COLOR_GRAY[200],
    marginTop: px(8),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: px(60),
  },
  emptyText: {
    fontFamily: 'Paperlogy',
    fontWeight: 700,
    fontSize: fontPx(16),
    color: COLOR_GRAY[200],
  },
});
