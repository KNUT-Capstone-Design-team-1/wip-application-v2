import { COLOR_PRIMARY } from '@constants/color';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  infoWrapper: {
    gap: 2,
    paddingBottom: 0,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontFamily: 'Paperlogy',
    color: COLOR_PRIMARY[200],
    fontSize: 16,
    fontWeight: 700,
    textAlign: 'left',
    marginBottom: 4,
    marginTop: 12,
  },
});
