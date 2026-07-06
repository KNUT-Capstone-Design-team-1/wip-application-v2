import { StyleSheet } from 'react-native';
import { COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: px(24),
    paddingHorizontal: px(16),
  },
  paginationButton: {
    paddingVertical: px(10),
    paddingHorizontal: px(20),
    backgroundColor: COLOR_PRIMARY[200],
    borderRadius: px(8),
    minWidth: px(80),
    alignItems: 'center',
  },
  paginationButtonDisabled: {
    backgroundColor: COLOR_GRAY[100],
  },
  paginationButtonText: {
    color: '#fff',
  },
  paginationButtonTextDisabled: {
    color: '#888888',
  },
  pageIndicator: {
    color: '#333',
  },
});
