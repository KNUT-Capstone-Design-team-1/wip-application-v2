import { COLOR, COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Paperlogy',
    color: COLOR_PRIMARY[200],
    fontSize: 16,
    fontWeight: 700,
    textAlign: 'left',
  },
  externalLinkButton: {
    backgroundColor: '#004A94',
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
    marginBottom: 6,
    alignItems: 'center',
  },
  externalLinkButtonText: {
    fontFamily: 'Paperlogy',
    color: COLOR['white'],
    fontWeight: 700,
    fontSize: 14,
  },
  sourceText: {
    fontFamily: 'Paperlogy',
    fontSize: 12,
    color: COLOR_GRAY[300],
    fontWeight: 600,
    marginTop: 10,
    textAlign: 'left',
  },
  disclaimerText: {
    fontFamily: 'Paperlogy',
    fontSize: 12,
    color: COLOR['alert'],
    fontWeight: 600,
    lineHeight: 16,
  },
  disclaimerContainer: {
    marginBottom: 10,
    gap: 4,
  },
  reportButton: {
    alignSelf: 'flex-end',
  },
  reportButtonText: {
    fontFamily: 'Paperlogy',
    fontSize: 12,
    color: COLOR['alert'],
    fontWeight: 600,
    textDecorationLine: 'underline',
  },
  warningText: {
    fontFamily: 'Paperlogy',
    color: COLOR['alert'],
    fontWeight: 700,
    fontSize: 14,
  },
});
