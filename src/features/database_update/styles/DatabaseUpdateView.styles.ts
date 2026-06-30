import { COLOR, COLOR_PRIMARY, COLOR_GRAY } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR['white'],
  },
  logoContainer: {
    flex: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  noticeContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1.5,
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
  noticeText: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(16),
    fontWeight: 500,
    color: COLOR_GRAY[400],
    marginBottom: px(16),
    textAlign: 'center',
    paddingHorizontal: px(20),
    lineHeight: fontPx(24),
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
    marginTop: px(8),
  },
  percentText: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(16),
    color: COLOR_PRIMARY[100],
    fontWeight: 700,
    marginBottom: px(4),
  },
});
