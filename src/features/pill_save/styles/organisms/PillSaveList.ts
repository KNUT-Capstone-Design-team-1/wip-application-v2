import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { bottomTabSize } from '@constants/size';

export const styles = StyleSheet.create({
  pillSaveListWrapper: {
    flex: 1,
    paddingHorizontal: px(8),
  },
  pillSaveListContent: {
    paddingTop: px(14),
    paddingBottom: px(20) + bottomTabSize.height,
  },
  pillSaveColumnWrapper: {
    justifyContent: 'flex-start',
    gap: px(12),
    marginBottom: px(12),
  },
});
