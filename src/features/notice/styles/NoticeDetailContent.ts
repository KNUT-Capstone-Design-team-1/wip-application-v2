import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  noticeDetailWrapper: {
    display: 'flex',
    padding: px(10),
  },
  noticeTitle: {
    marginBottom: px(8),
    color: '#333',
  },
  noticeDateWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noticeDate: {
    color: '#999',
    marginBottom: px(12),
  },
  hr: {
    height: px(1),
    backgroundColor: '#e0e0e0',
    marginTop: px(8),
  },
  noticeContent: {
    marginTop: px(20),
    lineHeight: px(20),
    color: '#444',
  },
});
