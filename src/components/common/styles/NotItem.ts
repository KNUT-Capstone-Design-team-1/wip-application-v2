import { StyleSheet } from 'react-native';
import { COLOR_PRIMARY } from '@constants/color';

export const styles = StyleSheet.create({
  notItemWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    height: '100%',
  },
  mainText: {
    fontFamily: 'Jalnan2',
    fontSize: 20,
  },
  subText: {
    fontFamily: 'Jalnan2',
    color: COLOR_PRIMARY[100],
    fontSize: 14,
  },
  icon: {
    marginTop: 20,
  },
});
