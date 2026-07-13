import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';

export const styles = StyleSheet.create({
  menuButton: {
    borderRadius: px(13),
    backgroundColor: COLOR_BG['surface'],
    elevation: 5,
    shadowColor: COLOR['shadow'] || '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradientBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.8,
    borderRadius: px(13),
  },
  menuContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: px(16),
  },
  buttonImgWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImg: {
    width: '100%',
    height: '100%',
  },
  buttonContentWrapper: {
    flex: 2.5,
    alignItems: 'center',
    gap: px(4),
  },
  title: {
    color: COLOR_TEXT['white'],
  },
  content: {
    color: COLOR_TEXT['white'],
  },
});
