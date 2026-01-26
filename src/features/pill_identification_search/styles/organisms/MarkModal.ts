import { StyleSheet, Dimensions } from 'react-native';
import { COLOR_GRAY } from '@/src/constants';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    width: Math.min(width * 0.92, 400),
    height: Math.min(height * 0.65, 600),
    elevation: 6,
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: 6,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLOR_GRAY[200],
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  searchWrapper: {
    marginBottom: 15,
  },
  errorContainer: {
    backgroundColor: '#fee',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  errorText: {
    color: '#c33',
    fontSize: 13,
    textAlign: 'center',
  },
  markListContainer: {
    flex: 1,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: COLOR_GRAY[200],
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: COLOR_GRAY[200],
    textAlign: 'center',
  },
});
