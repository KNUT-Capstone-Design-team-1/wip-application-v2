import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  noticeDataWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: px(16),
    borderBottomWidth: px(1),
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  noticeTitle: {
    fontFamily: 'Paperlogy',
    fontSize: fontPx(14),
    fontWeight: 700,
    color: '#333',
    marginBottom: px(4),
  },
  noticeDate: {
    fontFamily: 'Paperlogy',
    fontWeight: 400,
    fontSize: fontPx(12),
    color: '#999',
  },
  badge: {
    backgroundColor: '#32D2FF',
    paddingHorizontal: px(8),
    paddingVertical: px(4),
    borderRadius: px(4),
  },
  badgeText: {
    fontFamily: 'Jalnan2',
    color: '#fff',
    fontSize: fontPx(12),
    fontWeight: 200,
  },
});
