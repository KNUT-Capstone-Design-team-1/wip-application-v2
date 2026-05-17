import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  noticeDetailWrapper: {
    display: 'flex',
    padding: 10,
  },
  noticeTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  noticeDateWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noticeDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  hr: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 8,
  },
  noticeContent: {
    marginTop: 20,
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
});
