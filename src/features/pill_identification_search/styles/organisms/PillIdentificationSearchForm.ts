import { StyleSheet } from 'react-native';
import { COLOR_BG } from '@constants/color';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: { flex: 1, backgroundColor: COLOR_BG['base'] },
});
