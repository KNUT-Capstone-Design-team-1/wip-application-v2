import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    aspectRatio: 2,
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
});
