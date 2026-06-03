import { StyleSheet } from 'react-native';
import { COLOR, COLOR_PRIMARY } from '@constants/color';

export const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR_PRIMARY[200],
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    // ios
    shadowColor: COLOR['black'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // android
    elevation: 5,
    gap: 8,
  },
  buttonText: {
    fontFamily: 'Paperlogy',
    color: COLOR['white'],
    fontSize: 14,
    fontWeight: 600,
    includeFontPadding: false,
    paddingVertical: 0,
  },
});
