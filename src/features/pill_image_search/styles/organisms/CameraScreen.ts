import { StyleSheet } from 'react-native';
import { COLOR_GRAY, COLOR, COLOR_PRIMARY } from '@constants/color';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR['black'],
    justifyContent: 'space-between',
  },
  topOverlay: {
    paddingHorizontal: px(20),
    paddingBottom: px(20),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: px(12),
    width: px(36),
    height: px(36),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  title: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(18),
    fontWeight: 700,
    color: COLOR['white'],
    textAlign: 'center',
    marginBottom: px(16),
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
    fontWeight: 500,
    color: COLOR['white'],
    marginBottom: px(6),
    textAlign: 'center',
  },
  slotImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: px(8),
  },
  emptySlot: {
    aspectRatio: 1,
    borderRadius: px(8),
    borderWidth: px(2),
    borderStyle: 'dashed',
    borderColor: COLOR['white'],
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  guideView: {
    aspectRatio: 1,
  },
  guideCorner: {
    position: 'absolute',
    width: '25%',
    height: '25%',
    borderColor: COLOR['guide'],
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: px(2),
    borderLeftWidth: px(2),
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: px(2),
    borderRightWidth: px(2),
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: px(2),
    borderLeftWidth: px(2),
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: px(2),
    borderRightWidth: px(2),
  },
  bottomOverlay: {
    paddingTop: px(20),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    zIndex: 1,
  },
  captureButton: {
    width: px(80),
    height: px(80),
    borderRadius: px(40),
    backgroundColor: COLOR_GRAY[400],
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: px(64),
    height: px(64),
    borderRadius: px(32),
    backgroundColor: COLOR['white'],
  },
});
