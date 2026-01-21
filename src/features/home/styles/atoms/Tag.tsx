import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '../../../../constants';

export const styles = StyleSheet.create({
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
});
