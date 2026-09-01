import { StyleSheet } from 'react-native';
import { screenPadding } from '@constants/size';
import { COLOR_BG } from '@constants/color';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: screenPadding.horizontal,
    paddingTop: screenPadding.top,
    backgroundColor: COLOR_BG['surface'],
  },
});
