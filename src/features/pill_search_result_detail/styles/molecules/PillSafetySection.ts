import { COLOR, COLOR_TEXT } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    marginBottom: px(20),
  },
  title: {
    color: COLOR_TEXT['subTitle'],
    textAlign: 'left',
  },
  externalLinkButton: {
    backgroundColor: COLOR['tertiary'],
    padding: px(8),
    borderRadius: px(5),
    marginTop: px(8),
    marginBottom: px(6),
    alignItems: 'center',
  },
  externalLinkButtonText: {
    color: COLOR_TEXT['white'],
  },
  sourceText: {
    color: COLOR_TEXT['sub'],
    marginTop: px(12),
    textAlign: 'left',
  },
  disclaimerText: {
    color: COLOR_TEXT['sub'],
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
    color: COLOR['tertiary'],
    borderBottomWidth: px(1),
    borderBottomColor: COLOR['tertiary'],
  },
  normalText: {
    color: COLOR_TEXT['body'],
  },
  warningText: {
    color: COLOR['alert'],
  },
  smallInfoText: {
    color: COLOR_TEXT['sub'],
    marginTop: px(4),
  },
});
