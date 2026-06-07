import { StyleSheet } from 'react-native';
import { COLOR_GRAY, COLOR, COLOR_PRIMARY } from '@constants/color';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR['black'],
  },
  topOverlay: {
    paddingHorizontal: px(20),
    paddingBottom: px(20),
    backgroundColor: COLOR['black'],
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
  bottomOverlay: {
    paddingTop: px(20),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
