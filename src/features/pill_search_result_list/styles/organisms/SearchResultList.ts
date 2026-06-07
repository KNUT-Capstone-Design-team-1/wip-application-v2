import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  searchResultListWrapper: {
    marginTop: px(20),
    flexDirection: 'column',
  },
  hr: {
    width: '100%',
    height: px(1),
    backgroundColor: COLOR_GRAY[100],
  },
});
