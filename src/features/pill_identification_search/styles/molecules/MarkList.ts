import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '@/src/constants';

export const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
  },
  markItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR_GRAY[150],
  },
  markImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
  },
  markInfo: {
    flex: 1,
  },
  markTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  markCode: {
    fontSize: 13,
    color: COLOR_GRAY[200],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: COLOR_GRAY[200],
  },
})
