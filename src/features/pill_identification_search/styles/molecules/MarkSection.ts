import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '@constants/color';

export const styles = StyleSheet.create({
  selectMarkContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  markResultContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  markResult: {
    fontWeight: '600',
    fontSize: 14,
    color: COLOR_GRAY[300],
  },
  markImageWrapper: {
    position: 'relative',
    width: 50,
    height: 40,
  },
  markImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  selectedMarkDelete: {
    position: 'absolute',
    zIndex: 5,
    right: -5,
    top: -10,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLOR_GRAY[200],
    borderWidth: 2,
    borderColor: COLOR_GRAY[200],
    borderRadius: 12,
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: 14,
    backgroundColor: '#fff',
  },
});
