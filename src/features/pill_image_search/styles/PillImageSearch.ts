import { COLOR, COLOR_GRAY } from '@constants/color';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR['white'],
  },
  contentContainer: {
    paddingHorizontal: '5%',
    paddingBottom: 40,
  },
  hr: {
    width: '100%',
    height: 1,
    backgroundColor: COLOR_GRAY[100],
    marginTop: 30,
    marginBottom: 30,
  },
});
