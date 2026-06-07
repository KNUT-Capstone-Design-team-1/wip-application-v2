import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';

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
    fontSize: fontPx(20),
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontFamily: 'Paperlogy',
    fontWeight: 500,
    marginTop: px(16),
    fontSize: fontPx(16),
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Paperlogy',
    fontWeight: 500,
    fontSize: fontPx(16),
    color: '#999',
  },
});
