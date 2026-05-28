import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '@constants/color';

export const styles = StyleSheet.create({
  selectMarkContainer: {
    width: '100%',
  },
  markResultContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: COLOR_GRAY[100],
    borderRadius: 15,
    backgroundColor: '#fff',
    // ios
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    // android
    elevation: 1,
  },
  markImageWrapper: {
    width: '23.5%',
    aspectRatio: 1,
  },
  markImage: {
    width: '100%',
    height: '100%',
  },
  markTitle: {
    fontFamily: 'Paperlogy',
    fontWeight: 700,
    fontSize: 14,
    color: COLOR_GRAY[400],
    textAlign: 'center',
  },
  selectedMarkDelete: {
    position: 'absolute',
    padding: 4,
    zIndex: 5,
    right: 2,
    top: 2,
  },
});
