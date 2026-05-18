import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '@constants/index';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  hr: {
    width: '100%',
    height: 1,
    backgroundColor: COLOR_GRAY[150],
    marginTop: 20,
  },
});
