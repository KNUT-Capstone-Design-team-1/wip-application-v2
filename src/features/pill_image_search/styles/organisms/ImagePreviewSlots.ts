import { StyleSheet } from 'react-native';
import { COLOR_GRAY, COLOR_PRIMARY } from '../../../../constants';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    marginTop: px(30),
  },
  titleWrapper: {
    flexDirection: 'row',
    marginBottom: px(20),
    alignItems: 'center',
    justifyContent: 'center',
    gap: px(4),
  },
  title: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(18),
    fontWeight: 700,
    color: COLOR_PRIMARY[300],
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
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: px(10),
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
