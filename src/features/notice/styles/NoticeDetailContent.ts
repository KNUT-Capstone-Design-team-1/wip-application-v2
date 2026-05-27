import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  noticeDetailWrapper: {
    display: 'flex',
    padding: 10,
  },
  noticeTitle: {
    fontFamily: 'Paperlogy',
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 8,
    color: '#333',
  },
  noticeDateWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noticeDate: {
    fontFamily: 'Paperlogy',
    fontWeight: 400,
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
    fontFamily: 'Paperlogy',
    fontWeight: 500,
    marginTop: 20,
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
});
