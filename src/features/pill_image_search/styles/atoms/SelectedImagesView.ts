import { StyleSheet } from 'react-native';
import { COLOR, COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    marginTop: px(30),
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(18),
    fontWeight: 700,
    color: COLOR_PRIMARY[400],
    marginBottom: px(20),
  },
  imagesWrapper: {
    flexDirection: 'row',
    gap: px(16),
    width: '100%',
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(14),
    fontWeight: 600,
    color: COLOR_PRIMARY[300],
    marginBottom: px(8),
  },
  imageBox: {
    position: 'relative',
    width: px(140),
    height: px(140),
    borderRadius: px(12),
    borderWidth: px(2),
    borderColor: COLOR_GRAY[100],
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  checkmark: {
    position: 'absolute',
    top: px(6),
    right: px(6),
    width: px(20),
    height: px(20),
    borderRadius: px(14),
    backgroundColor: COLOR['normal'],
    justifyContent: 'center',
    alignItems: 'center',
  },
});
