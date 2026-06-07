import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  pillSaveListWrapper: {
    flex: 1,
    paddingHorizontal: px(8),
  },
  pillSaveListContent: {
    paddingTop: px(14),
    paddingBottom: px(20),
  },
  pillSaveColumnWrapper: {
    justifyContent: 'flex-start',
    gap: px(12),
    marginBottom: px(12),
  },
});
