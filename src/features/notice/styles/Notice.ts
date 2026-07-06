import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: px(16),
    borderBottomWidth: px(1),
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: px(16),
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
  },
});
