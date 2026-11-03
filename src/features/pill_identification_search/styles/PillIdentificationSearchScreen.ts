import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  guideToolbar: {
    alignItems: 'flex-end',
    paddingHorizontal: px(16),
    paddingVertical: px(4),
  },
  guideButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    padding: px(4),
  },
});
