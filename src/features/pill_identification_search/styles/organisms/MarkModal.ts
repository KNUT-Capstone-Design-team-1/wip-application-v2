import { StyleSheet, Dimensions } from 'react-native';
import { px } from '@utils/responsive';
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
    paddingVertical: px(16),
    paddingHorizontal: px(20),
    borderRadius: px(16),
    width: Math.min(width * 0.92, px(400)),
    height: Math.min(height * 0.63, px(600)),
    elevation: 6,
  },
  closeButton: {
    position: 'absolute',
    top: px(6),
    right: px(6),
    padding: px(6),
    zIndex: 10,
  },
  title: {
    textAlign: 'center',
    color: COLOR_PRIMARY[400],
    marginBottom: px(16),
  },
  searchWrapper: {
    marginBottom: px(16),
  },
  errorContainer: {
    backgroundColor: '#fee',
    padding: px(10),
    borderRadius: px(6),
    marginBottom: px(10),
  },
  errorText: {
    color: COLOR['error'],
    textAlign: 'center',
  },
  markListContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: px(10),
    color: COLOR_GRAY[200],
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: px(60),
  },
  emptyText: {
    color: COLOR_GRAY[200],
    textAlign: 'center',
  },
});
