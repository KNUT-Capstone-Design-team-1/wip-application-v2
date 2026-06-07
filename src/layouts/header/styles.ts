import { StyleSheet } from 'react-native';
import { COLOR, COLOR_PRIMARY } from '../../constants';
import { FONT_JALNAN2_WEIGHT, FONT_PAPERLOGY_WEIGHT } from '@constants/font';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.white,
    paddingHorizontal: px(20),
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: px(50),
  },
  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: px(40),
  },
  logoText: {
    fontSize: fontPx(18),
    ...FONT_JALNAN2_WEIGHT['regular'],
  },
  menuButton: {
    width: px(40),
    height: px(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    width: px(24),
    height: px(24),
    tintColor: COLOR_PRIMARY[200],
  },
  backButton: {
    width: px(40),
    height: px(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: fontPx(18),
    color: COLOR_PRIMARY[200],
    textAlign: 'center',
    ...FONT_PAPERLOGY_WEIGHT['bold'],
  },
});
