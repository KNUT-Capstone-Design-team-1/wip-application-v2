import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: px(4) },
    shadowOpacity: 0.4,
    shadowRadius: px(5),
    elevation: 8,
    marginBottom: px(8),
  },
});
