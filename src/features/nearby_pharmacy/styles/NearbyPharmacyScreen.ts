import { StyleSheet } from 'react-native';
import { COLOR, COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: COLOR['white'],
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 10,
    shadowColor: COLOR['black'],
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6.68,
  },
  infoContent: {
    flex: 1,
  },
  pharmacyPhoneCopyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 5,
  },
  pharmacyName: {
    fontFamily: 'Paperlogy',
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 5,
    color: COLOR['black'],
  },
  pharmacyPhone: {
    fontFamily: 'Paperlogy',
    fontWeight: 500,
    fontSize: 14,
    color: COLOR_PRIMARY[200],
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  pharmacyAddress: {
    fontFamily: 'Paperlogy',
    fontSize: 14,
    fontWeight: 600,
    color: COLOR_PRIMARY[300],
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
});
