import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR_BG, COLOR_TEXT } from '@constants/color';
import { screenPadding } from '@constants/size';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: screenPadding.top,
    paddingHorizontal: screenPadding.horizontal,
    backgroundColor: COLOR_BG['surface'],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR_BG['surface'],
  },
  loadingText: {
    marginTop: px(16),
    color: COLOR_TEXT['subTitle'],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: COLOR_TEXT['sub'],
  },
});
