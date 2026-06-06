import { COLOR_GRAY } from '@constants/color';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  infoContainer: {
    paddingHorizontal: 4,
  },
  infoMoreBtn: {
    borderBottomColor: COLOR_GRAY[100],
    borderBottomWidth: 1.5,
    marginBottom: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  infoMoreBtnText: {
    fontFamily: 'Paperlogy',
    color: COLOR_GRAY[300],
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'center',
  },
  detailInfoContainer: {
    paddingBottom: 200,
  },
});
