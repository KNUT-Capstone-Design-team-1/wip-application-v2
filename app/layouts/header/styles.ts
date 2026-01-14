import { StyleSheet } from 'react-native';
import { COLOR, COLOR_PRIMARY } from '@/app/constants/color';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },
  logo: {
    height: 32,
    width: 100,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: COLOR_PRIMARY[200],
  },
});
