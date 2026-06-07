import { COLOR, COLOR_PRIMARY } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR['white'],
  },
  logoContainer: {
    flex: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  statusText: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(18),
    fontWeight: 700,
    color: COLOR_PRIMARY[100],
    marginBottom: px(12),
  },
  progressBarContainer: {
    width: px(250),
    height: px(10),
    backgroundColor: COLOR['white'],
    borderRadius: px(5),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLOR_PRIMARY[100],
    borderRadius: px(5),
  },
  detailsContainer: {
    alignItems: 'center',
  },
  percentText: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(16),
    color: COLOR['white'],
    fontWeight: 700,
    marginBottom: px(4),
  },
  pageText: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(14),
    fontWeight: 700,
    color: COLOR['white'],
    opacity: 0.9,
  },
});
