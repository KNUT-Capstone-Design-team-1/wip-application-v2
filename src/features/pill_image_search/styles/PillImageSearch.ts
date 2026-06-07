import { COLOR, COLOR_GRAY } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR['white'],
  },
  contentContainer: {
    paddingHorizontal: '5%',
    paddingBottom: px(40),
  },
  hr: {
    width: '100%',
    height: px(1),
    backgroundColor: COLOR_GRAY[100],
    marginTop: px(30),
    marginBottom: px(30),
  },
});
