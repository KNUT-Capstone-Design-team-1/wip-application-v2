import { StyleSheet, Dimensions } from 'react-native';
import { COLOR, COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: COLOR['white'],
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    width: Math.min(width * 0.92, 400),
    height: Math.min(height * 0.65, 600),
    elevation: 6,
  },
  closeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    padding: 6,
    zIndex: 10,
  },
  title: {
    fontFamily: 'Paperlogy',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 700,
    color: COLOR_PRIMARY[400],
    marginBottom: 16,
  },
  searchWrapper: {
    marginBottom: 16,
  },
  errorContainer: {
    backgroundColor: '#fee',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  errorText: {
    fontFamily: 'Paperlogy',
    fontWeight: 700,
    color: COLOR['error'],
    fontSize: 13,
    textAlign: 'center',
  },
  markListContainer: {
    flex: 1,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Paperlogy',
    fontWeight: 700,
    marginTop: 10,
    fontSize: 16,
    color: COLOR_GRAY[200],
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontFamily: 'Paperlogy',
    fontWeight: 700,
    fontSize: 16,
    color: COLOR_GRAY[200],
    textAlign: 'center',
  },
});
