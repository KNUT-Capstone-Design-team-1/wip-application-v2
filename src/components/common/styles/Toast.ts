import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: px(100),
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  toastContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: px(20),
    paddingVertical: px(12),
    borderRadius: px(8),
    maxWidth: '80%',
  },
  toastText: {
    color: '#ffffff',
    fontSize: fontPx(14),
    fontWeight: '500',
    textAlign: 'center',
  },
});
