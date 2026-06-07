import { StyleSheet } from 'react-native';
import { COLOR_GRAY, COLOR_PRIMARY } from '../../../../constants';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    marginBottom: px(20),
  },
  title: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(16),
    fontWeight: 700,
    color: COLOR_PRIMARY[400],
    marginBottom: px(12),
  },
  slotsWrapper: {
    flexDirection: 'row',
    gap: px(12),
  },
  slot: {
    flex: 1,
  },
  label: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(14),
    fontWeight: 600,
    color: COLOR_PRIMARY[300],
    marginBottom: px(8),
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
    borderRadius: px(10),
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: px(4),
    right: px(4),
    width: px(24),
    height: px(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySlot: {
    aspectRatio: 1,
    borderRadius: px(10),
    borderWidth: px(2),
    borderStyle: 'dashed',
    borderColor: COLOR_GRAY[200],
    backgroundColor: COLOR_GRAY[150],
    justifyContent: 'center',
    alignItems: 'center',
  },
});
