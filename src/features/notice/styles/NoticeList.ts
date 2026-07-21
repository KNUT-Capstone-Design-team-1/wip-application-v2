import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR_LINE } from '@constants/color';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noticeListWrapper: {
    flex: 1,
  },
  noticeListItemWrapper: {
    borderBottomWidth: px(1),
    borderBottomColor: COLOR_LINE['separator'],
  },
  noticeBottomWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: px(12),
    gap: px(16),
  },
});
