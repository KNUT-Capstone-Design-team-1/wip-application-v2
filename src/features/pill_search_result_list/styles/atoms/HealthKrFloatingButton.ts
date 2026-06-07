import { StyleSheet } from 'react-native';
import { COLOR, COLOR_PRIMARY } from '@constants/color';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: px(30),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR_PRIMARY[200],
    paddingVertical: px(12),
    paddingHorizontal: px(20),
    borderRadius: px(30),
    // ios
    shadowColor: COLOR['black'],
    shadowOffset: { width: 0, height: px(2) },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // android
    elevation: 5,
    gap: px(8),
  },
  buttonText: {
    fontFamily: 'Paperlogy',
    color: COLOR['white'],
    fontSize: fontPx(14),
    fontWeight: 600,
    includeFontPadding: false,
    paddingVertical: 0,
  },
});
