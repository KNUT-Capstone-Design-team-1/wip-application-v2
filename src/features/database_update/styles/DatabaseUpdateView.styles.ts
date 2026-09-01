import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_BG['surface'],
  },
  topContainer: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: px(32),
  },
  topTitleWrapper: {
    paddingBottom: px(4),
    alignItems: 'center',
  },
  topTitle: {
    color: COLOR_TEXT['subTitle'],
  },
  downContainer: {
    alignItems: 'center',
    backgroundColor: COLOR['primary'],
    paddingTop: px(8),
  },
  downTitle: {
    color: COLOR_TEXT['white'],
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
    color: COLOR_TEXT['white'],
    marginBottom: px(12),
  },
  noticeText: {
    color: COLOR_TEXT['white'],
    marginBottom: px(16),
    textAlign: 'center',
    paddingHorizontal: px(20),
    lineHeight: fontPx(24),
  },
  progressBarContainer: {
    width: px(250),
    height: px(10),
    backgroundColor: COLOR['tertiary'],
    borderRadius: px(5),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLOR['white'],
    borderRadius: px(5),
  },
  detailsContainer: {
    alignItems: 'center',
    marginTop: px(8),
  },
  percentText: {
    color: COLOR_TEXT['white'],
    marginBottom: px(4),
  },
  logoImage: { width: '38%' },
});
