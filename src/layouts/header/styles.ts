import { StyleSheet } from 'react-native';
import { COLOR, COLOR_TEXT } from '../../constants';
import { px } from '@utils/responsive';

const HEADER_MIN_HEIGHT = px(54);

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR['white'],
    paddingHorizontal: px(8),
  },
  HeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: HEADER_MIN_HEIGHT,
    paddingHorizontal: px(12),
  },
  subHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: HEADER_MIN_HEIGHT,
  },
  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {},
  menuButton: {
    width: px(40),
    height: px(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    width: px(40),
    height: px(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    color: COLOR_TEXT['subTitle'],
    textAlign: 'center',
  },
});
