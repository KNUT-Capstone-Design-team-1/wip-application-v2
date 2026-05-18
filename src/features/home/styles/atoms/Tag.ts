import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '@constants/index';

export const styles = StyleSheet.create({
  tagContainer: {
    position: 'relative',
  },
  tagWrapper: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: COLOR_GRAY[500],
  },
  tagTitle: {
    fontSize: 14,
    color: COLOR_GRAY[400],
  },
  deleteButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLOR_GRAY[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    lineHeight: 16,
  },
});
