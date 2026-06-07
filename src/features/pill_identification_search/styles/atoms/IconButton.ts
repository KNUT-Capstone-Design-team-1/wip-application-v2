import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';
import { COLOR_GRAY } from '@constants/color';

export const styles = StyleSheet.create({
  iconButtonWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    borderRadius: px(15),
    borderWidth: 2,
    borderColor: COLOR_GRAY[150],
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  iconButtonTop: {
    width: '100%',
    height: '70%',
    borderBottomWidth: 2,
    borderBottomColor: COLOR_GRAY[150],
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '50%',
    height: '50%',
  },
  iconButtonBottom: {
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: px(15),
    borderBottomRightRadius: px(15),
    overflow: 'hidden',
    paddingHorizontal: px(2),
  },
  iconSectionLabel: {
    color: COLOR_GRAY[300],
    textAlign: 'center',
    fontFamily: 'Paperlogy',
    fontWeight: 500,
    fontSize: fontPx(13),
  },
});
