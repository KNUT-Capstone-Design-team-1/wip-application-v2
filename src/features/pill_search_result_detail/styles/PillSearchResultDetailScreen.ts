import { COLOR, COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  scrollViewWrapper: {
    backgroundColor: COLOR['white'],
    flex: 1,
  },
  viewWrapper: {
    backgroundColor: COLOR['white'],
    flex: 1,
    overflow: 'hidden',
    paddingHorizontal: px(16),
  },
  pillImgWrapper: {
    aspectRatio: 1299 / 709,
    borderRadius: px(18),
    marginTop: px(16),
    overflow: 'hidden',
    width: '100%',
    backgroundColor: COLOR['white'],
  },
  pillImg: {
    height: '100%',
    width: '100%',
  },
  pillDetailNoImageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR_GRAY[150],
  },
  pillDetailNoImageText: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(16),
    fontWeight: 600,
    color: COLOR_PRIMARY[400],
    paddingHorizontal: px(16),
    paddingVertical: px(16),
  },
  pillResultDetailRoot: {
    flex: 1,
    backgroundColor: COLOR['white'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillResultDetailNotFoundText: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(18),
    fontWeight: 600,
    color: COLOR['black'],
    paddingHorizontal: px(16),
    paddingVertical: px(16),
  },
  disclaimerWrapper: {
    marginTop: px(24),
    marginBottom: px(40),
    padding: px(16),
    backgroundColor: COLOR_GRAY[150],
    borderRadius: px(8),
    borderWidth: 1,
    borderColor: COLOR_GRAY[250],
  },
  disclaimerText: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(13),
    fontWeight: 600,
    color: COLOR_GRAY[400],
    lineHeight: px(20),
    textAlign: 'center',
  },
});
