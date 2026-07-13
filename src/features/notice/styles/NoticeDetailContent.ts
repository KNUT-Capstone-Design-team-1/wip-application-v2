import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR_LINE, COLOR_TEXT } from '@constants/color';

export const styles = StyleSheet.create({
  noticeDetailWrapper: {
    display: 'flex',
    paddingBottom: px(12),
  },
  noticeTitle: {
    marginBottom: px(8),
    color: COLOR_TEXT['title'],
  },
  noticeDateWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noticeDate: {
    color: COLOR_TEXT['sub'],
  },
  hr: {
    height: px(1),
    backgroundColor: COLOR_LINE['separator'],
    marginVertical: px(16),
  },
  noticeContent: {
    color: COLOR_TEXT['body'],
  },
});
