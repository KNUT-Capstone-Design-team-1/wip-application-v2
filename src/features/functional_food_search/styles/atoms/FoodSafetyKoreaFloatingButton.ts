import { StyleSheet } from 'react-native';
import { COLOR } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: px(30),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR['secondary'],
    paddingVertical: px(12),
    paddingHorizontal: px(20),
    borderRadius: px(30),
    // ios
    shadowColor: COLOR['shadow'],
    shadowOffset: { width: 0, height: px(2) },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // android
    elevation: 5,
    gap: px(8),
  },
  buttonText: {
    color: COLOR['white'],
    includeFontPadding: false,
    paddingVertical: 0,
  },
});
