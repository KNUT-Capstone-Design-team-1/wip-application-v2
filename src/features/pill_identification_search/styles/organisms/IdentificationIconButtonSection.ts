import { StyleSheet } from 'react-native';
import { COLOR } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    marginBottom: px(2),
    backgroundColor: COLOR['white'],
    paddingHorizontal: px(20),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 6,
  },
  buttonWrapper: {
    width: '23.5%',
    marginBottom: 4,
  },
});
