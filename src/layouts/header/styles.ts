import { StyleSheet } from 'react-native';
import { COLOR, COLOR_TEXT } from '../../constants';
import { px } from '@utils/responsive';

const HEADER_MIN_HEIGHT = px(54);

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR['white'],
    paddingHorizontal: px(8),
  },
  navigateBarContainer: {
    marginLeft: px(32),
    flex: 1,
  },
  HeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: HEADER_MIN_HEIGHT,
    paddingHorizontal: px(12),
  },
  subHeaderContent: {
    paddingHorizontal: px(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: HEADER_MIN_HEIGHT,
  },
  searchHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: HEADER_MIN_HEIGHT,
    paddingRight: px(12),
    gap: px(4),
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
  headerTitleContainer: {
    flex: 1,
    minWidth: 0,
    height: px(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    width: '100%',
    color: COLOR_TEXT['subTitle'],
    textAlign: 'center',
  },
});
