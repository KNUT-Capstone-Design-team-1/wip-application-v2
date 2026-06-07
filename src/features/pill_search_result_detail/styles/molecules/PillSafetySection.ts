import { COLOR, COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    marginBottom: px(20),
  },
  title: {
    fontFamily: 'Paperlogy',
    color: COLOR_PRIMARY[200],
    fontSize: fontPx(16),
    fontWeight: 700,
    textAlign: 'left',
  },
  externalLinkButton: {
    backgroundColor: '#004A94',
    padding: px(8),
    borderRadius: px(5),
    marginTop: px(8),
    marginBottom: px(6),
    alignItems: 'center',
  },
  externalLinkButtonText: {
    fontFamily: 'Paperlogy',
    color: COLOR['white'],
    fontWeight: 700,
    fontSize: fontPx(14),
  },
  sourceText: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(12),
    color: COLOR_GRAY[300],
    fontWeight: 600,
    marginTop: px(10),
    textAlign: 'left',
  },
  disclaimerText: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(12),
    color: COLOR['alert'],
    fontWeight: 600,
    lineHeight: px(16),
  },
  disclaimerContainer: {
    marginBottom: px(10),
    gap: px(4),
  },
  reportButton: {
    alignSelf: 'flex-end',
  },
  reportButtonText: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(12),
    color: COLOR['alert'],
    fontWeight: 600,
    textDecorationLine: 'underline',
  },
  warningText: {
    fontFamily: 'Paperlogy',
    color: COLOR['alert'],
    fontWeight: 700,
    fontSize: fontPx(14),
  },
});
