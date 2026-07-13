import { StyleSheet } from 'react-native';
import { COLOR } from '@constants/color';
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
    color: COLOR['primary'],
  },
  icon: {
    marginTop: px(20),
  },
});
