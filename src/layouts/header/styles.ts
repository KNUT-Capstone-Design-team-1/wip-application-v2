import { StyleSheet } from 'react-native';
import { COLOR, COLOR_PRIMARY } from '../../constants';
import { FONT_JALNAN2_WEIGHT, FONT_PAPERLOGY_WEIGHT } from '@constants/font';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.white,
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50,
  },
  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  logoText: {
    fontSize: 18,
    ...FONT_JALNAN2_WEIGHT['regular'],
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    color: COLOR_PRIMARY[200],
    textAlign: 'center',
    ...FONT_PAPERLOGY_WEIGHT['bold'],
  },
});
