import { StyleSheet } from 'react-native';
import { COLOR_PRIMARY } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  notItemWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: px(16),
    height: '100%',
  },
  mainText: {},
  subText: {
    color: COLOR_PRIMARY[100],
  },
  icon: {
    marginTop: px(20),
  },
});
