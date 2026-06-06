import { StyleSheet } from 'react-native';
import { COLOR_GRAY, COLOR, COLOR_PRIMARY } from '@constants/color';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR['black'],
  },
  topOverlay: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: COLOR['black'],
    zIndex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  title: {
    fontFamily: 'Paperlogy',
    fontSize: 18,
    fontWeight: 700,
    color: COLOR['white'],
    textAlign: 'center',
    marginBottom: 16,
  },
  slotsWrapper: {
    flexDirection: 'row',
    gap: 12,
  },
  slot: {
    flex: 1,
  },
  label: {
    fontFamily: 'Paperlogy',
    fontSize: 14,
    fontWeight: 500,
    color: COLOR['white'],
    marginBottom: 6,
    textAlign: 'center',
  },
  slotImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  emptySlot: {
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLOR['white'],
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomOverlay: {
    paddingTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    zIndex: 1,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLOR_GRAY[400],
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLOR['white'],
  },
});
