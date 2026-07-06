import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

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
    color: '#333',
    marginBottom: px(4),
  },
  noticeDate: {
    color: '#999',
  },
  badge: {
    backgroundColor: '#32D2FF',
    paddingHorizontal: px(8),
    paddingVertical: px(4),
    borderRadius: px(4),
  },
  badgeText: {
    color: '#fff',
  },
});
