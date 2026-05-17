import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '@constants/color';

export const styles = StyleSheet.create({
  searchResultListWrapper: {
    display: 'flex',
    marginTop: 20,
    flexDirection: 'column',
  },
  hr: {
    width: '100%',
    height: 1,
    backgroundColor: COLOR_GRAY[100],
  },
});
