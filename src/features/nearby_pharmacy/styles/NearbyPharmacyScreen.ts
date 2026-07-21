import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';
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
  bottomOverlay: {
    position: 'absolute',
    bottom: bottomTabSize.height,
    width: '100%',
    zIndex: 999,
  },
  infoContainer: {
    marginHorizontal: px(20),
    marginBottom: px(22),
    backgroundColor: COLOR_BG['surface'],
    borderRadius: px(15),
    paddingVertical: px(12),
    paddingHorizontal: px(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 10,
    shadowColor: COLOR['shadow'],
    shadowOffset: { width: 0, height: px(5) },
    shadowOpacity: 0.3,
    shadowRadius: 6.68,
  },
  infoContent: {
    flex: 1,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(4),
    marginBottom: px(5),
  },
  pharmacyName: {
    color: COLOR_TEXT['title'],
  },
  pharmacyPhone: {
    color: COLOR_TEXT['subTitle'],
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  pharmacyAddress: {
    color: COLOR_TEXT['body'],
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: px(8),
    right: px(8),
    padding: px(4),
  },
});
