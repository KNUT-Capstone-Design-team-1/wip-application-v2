import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  menuButton: {
    borderRadius: px(13),
  },
  buttonImgWrapper: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: '60%',
    paddingTop: px(4),
  },
  buttonContentWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Paperlogy',
    fontWeight: 700,
    fontSize: fontPx(16),
    color: '#fff',
  },
  content: {
    fontFamily: 'Paperlogy',
    fontWeight: 300,
    fontSize: fontPx(11),
    color: '#fff',
  },
});
