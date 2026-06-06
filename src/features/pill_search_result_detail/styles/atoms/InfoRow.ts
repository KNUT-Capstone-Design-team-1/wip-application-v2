import { COLOR, COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_GRAY[100],
  },
  infoLabel: {
    fontFamily: 'Paperlogy',
    fontSize: 14,
    fontWeight: 600,
    color: COLOR_PRIMARY[400],
    width: 100,
  },
  infoValue: {
    fontFamily: 'Paperlogy',
    fontSize: 14,
    fontWeight: 500,
    color: COLOR['black'],
    flex: 1,
  },
});
