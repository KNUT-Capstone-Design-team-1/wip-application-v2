import { StyleSheet } from 'react-native';
import { COLOR, COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';
import { px, fontPx } from '@utils/responsive';
import { bottomTabSize } from '@constants/size';

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
    bottom: px(20) + bottomTabSize.height,
    left: px(20),
    right: px(20),
    backgroundColor: COLOR['white'],
    borderRadius: px(15),
    paddingVertical: px(12),
    paddingHorizontal: px(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 10,
    shadowColor: COLOR['black'],
    shadowOffset: { width: 0, height: px(5) },
    shadowOpacity: 0.3,
    shadowRadius: 6.68,
  },
  infoContent: {
    flex: 1,
  },
  pharmacyPhoneCopyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(4),
    marginBottom: px(5),
  },
  pharmacyName: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(18),
    fontWeight: 700,
    marginBottom: px(5),
    color: COLOR['black'],
  },
  pharmacyPhone: {
    fontFamily: 'Paperlogy',
    fontWeight: 500,
    fontSize: fontPx(14),
    color: COLOR_PRIMARY[200],
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  pharmacyAddress: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(14),
    fontWeight: 600,
    color: COLOR_PRIMARY[300],
  },
  closeButton: {
    position: 'absolute',
    top: px(8),
    right: px(8),
    padding: px(4),
  },
});
