import { COLOR, COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    marginBottom: px(20),
  },
  title: {
    color: COLOR_PRIMARY[200],
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
    color: COLOR['white'],
  },
  sourceText: {
    color: COLOR_GRAY[300],
    marginTop: px(10),
    textAlign: 'left',
  },
  disclaimerText: {
    color: COLOR['alert'],
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
    color: COLOR['alert'],
    textDecorationLine: 'underline',
  },
  normalText: {
    color: COLOR['black'],
  },
  warningText: {
    color: COLOR['alert'],
  },
  smallInfoText: {
    color: COLOR_GRAY[400],
    marginTop: px(4),
  },
});
