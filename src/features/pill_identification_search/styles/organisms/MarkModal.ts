import { StyleSheet, Dimensions } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR, COLOR_TEXT } from '@constants/color';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: COLOR['white'],
    paddingTop: px(12),
    paddingHorizontal: px(20),
    paddingBottom: px(40),
    borderTopLeftRadius: px(24),
    borderTopRightRadius: px(24),
    width: '100%',
    height: height * 0.85,
    elevation: 6,
  },
  grabber: {
    width: px(40),
    height: px(4),
    backgroundColor: '#E0E0E0',
    borderRadius: px(2),
    alignSelf: 'center',
    marginBottom: px(16),
  },
  closeButton: {
    position: 'absolute',
    top: px(16),
    right: px(16),
    padding: px(6),
    zIndex: 10,
  },
  title: {
    textAlign: 'center',
    color: COLOR_TEXT['title'],
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
    color: COLOR_TEXT['sub'],
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: px(60),
  },
  emptyText: {
    color: COLOR_TEXT['sub'],
    textAlign: 'center',
  },
});
