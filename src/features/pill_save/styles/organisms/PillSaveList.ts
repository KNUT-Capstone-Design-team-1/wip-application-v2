import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { bottomTabSize } from '@constants/size';

export const styles = StyleSheet.create({
  pillSaveListWrapper: {
    flex: 1,
    paddingHorizontal: px(6),
  },
  pillSaveListContent: {
    paddingTop: 0,
    paddingBottom: px(20) + bottomTabSize.height,
  },
  emptyContainer: { flex: 1, padding: px(6) },
});
