import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  noticeDetailWrapper: {
    display: 'flex',
    padding: px(10),
  },
  noticeTitle: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(20),
    fontWeight: 700,
    marginBottom: px(8),
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
    fontSize: fontPx(12),
    color: '#999',
    marginBottom: px(12),
  },
  hr: {
    height: px(1),
    backgroundColor: '#e0e0e0',
    marginTop: px(8),
  },
  noticeContent: {
    fontFamily: 'Paperlogy',
    fontWeight: 500,
    marginTop: px(20),
    fontSize: fontPx(14),
    lineHeight: px(20),
    color: '#444',
  },
});
