import { StyleSheet } from 'react-native';
import { COLOR_PRIMARY } from '@constants/color';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  notItemWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: px(16),
    height: '100%',
  },
  mainText: {
    fontFamily: 'Jalnan2',
    fontSize: fontPx(20),
  },
  subText: {
    fontFamily: 'Jalnan2',
    color: COLOR_PRIMARY[100],
    fontSize: fontPx(14),
  },
  icon: {
    marginTop: px(20),
  },
});
