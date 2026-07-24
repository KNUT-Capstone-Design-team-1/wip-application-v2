import { px } from '@utils/responsive';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  skeletonContainer: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    paddingHorizontal: px(12),
    paddingVertical: px(8),
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: px(42, 50),
    height: px(42, 50),
    backgroundColor: '#C0C0C0',
    borderRadius: px(8),
    marginRight: px(12),
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  textPlaceholder: {
    width: '80%',
    height: px(16),
    backgroundColor: '#C0C0C0',
    borderRadius: px(4),
    marginBottom: px(8),
  },
  textSmall: {
    width: '50%',
    height: px(12),
  },
});
