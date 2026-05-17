import { StyleSheet } from 'react-native';
import { COLOR_PRIMARY } from '@constants/color';

export const styles = StyleSheet.create({
  notItemWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    height: '100%',
  },
  mainText: {
    fontSize: 20,
    fontWeight: 700,
  },
  subText: {
    color: COLOR_PRIMARY[100],
    fontSize: 14,
    fontWeight: 600,
  },
  icon: {
    marginTop: 20,
  },
});
